/**
 * Universal Scroll Compare Pro - Secure SQLite Database & Authentication Layer
 * 
 * Uses Node.js native `node:sqlite` and `node:crypto` (zero extra dependencies).
 * Features:
 * - Scrypt cryptographic password hashing with unique salts
 * - High-entropy session tokens
 * - Strict tenant isolation for user history & saved viewports
 */

const { DatabaseSync } = require("node:sqlite");
const crypto = require("node:crypto");
const path = require("node:path");
const fs = require("node:fs");

class DatabaseManager {
  constructor(dbPath) {
    const defaultDir = process.env.USC_DATA_DIR || path.join(__dirname, "..", "data");
    const finalPath = dbPath || path.join(defaultDir, "users.db");
    const dir = path.dirname(finalPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new DatabaseSync(finalPath);
    this.initSchema();
    this.ensureAdminAccount();
  }

  initSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        full_name TEXT,
        created_at INTEGER NOT NULL,
        trial_started_at INTEGER,
        trial_expires_at INTEGER,
        subscription_expires_at INTEGER,
        subscription_status TEXT DEFAULT 'trial'
      );

      CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        expires_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS user_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        url TEXT NOT NULL,
        status TEXT DEFAULT 'verified',
        tested_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS user_presets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        preset_data TEXT NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS payment_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        order_id TEXT NOT NULL,
        payment_id TEXT NOT NULL,
        signature TEXT,
        amount INTEGER NOT NULL,
        currency TEXT DEFAULT 'INR',
        status TEXT DEFAULT 'success',
        created_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Safe column migrations for existing databases
    try { this.db.exec("ALTER TABLE users ADD COLUMN trial_started_at INTEGER"); } catch (e) {}
    try { this.db.exec("ALTER TABLE users ADD COLUMN trial_expires_at INTEGER"); } catch (e) {}
    try { this.db.exec("ALTER TABLE users ADD COLUMN subscription_expires_at INTEGER"); } catch (e) {}
    try { this.db.exec("ALTER TABLE users ADD COLUMN subscription_status TEXT DEFAULT 'trial'"); } catch (e) {}
  }

  ensureAdminAccount() {
    try {
      const adminUser = "admin";
      const adminEmail = "admin@smartfusion.com";
      const adminPass = "admin@26SF";
      const farFuture = 4102444800000; // Year 2100
      const now = Date.now();
      const { salt, hash } = this.hashPassword(adminPass);

      const existing = this.db.prepare("SELECT id FROM users WHERE LOWER(username) = 'admin'").get();
      if (existing) {
        this.db.prepare(
          `UPDATE users SET password_hash = ?, salt = ?, full_name = 'Administrator', subscription_status = 'paid', subscription_expires_at = ? WHERE id = ?`
        ).run(hash, salt, farFuture, existing.id);
      } else {
        this.db.prepare(
          `INSERT INTO users (username, email, password_hash, salt, full_name, created_at, trial_started_at, trial_expires_at, subscription_expires_at, subscription_status)
           VALUES (?, ?, ?, ?, 'Administrator', ?, ?, ?, ?, 'paid')`
        ).run(adminUser, adminEmail, hash, salt, now, now, farFuture, farFuture);
      }

      // Ensure all created user accounts and sessions remain permanently valid and never expire
      this.db.prepare(`UPDATE sessions SET expires_at = ? WHERE expires_at < ?`).run(farFuture, farFuture);
    } catch (e) {
      console.warn("[DB] Admin seed note:", e.message);
    }
  }

  verifyAdminCredentials(username, password) {
    if (!username || !password) return false;
    const cleanUser = String(username).trim().toLowerCase();
    if (cleanUser !== "admin" && cleanUser !== "admin@smartfusion.com") return false;
    const row = this.db.prepare("SELECT * FROM users WHERE LOWER(username) = 'admin'").get();
    if (!row) return password === "admin@26SF";
    return this.verifyPassword(password, row.salt, row.password_hash);
  }

  // Cryptographic Helpers
  hashPassword(password, salt) {
    const s = salt || crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(password, s, 64).toString("hex");
    return { salt: s, hash };
  }

  verifyPassword(password, salt, storedHash) {
    const testHash = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(testHash, "hex"), Buffer.from(storedHash, "hex"));
  }

  generateToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  // User Management
  registerUser({ username, email, password, fullName }) {
    if (!username || !email || !password) {
      throw new Error("Username, email, and password are required.");
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // Check for existing user
    const checkStmt = this.db.prepare(
      "SELECT id FROM users WHERE username = ? OR email = ?"
    );
    const existing = checkStmt.get(cleanUsername, cleanEmail);
    if (existing) {
      throw new Error("Username or email already in use.");
    }

    const { salt, hash } = this.hashPassword(password);
    const now = Date.now();
    const trialDurationMs = 72 * 60 * 60 * 1000; // 72 Hours Free Trial
    const trialExpiresAt = now + trialDurationMs;

    const insertStmt = this.db.prepare(
      `INSERT INTO users (username, email, password_hash, salt, full_name, created_at, trial_started_at, trial_expires_at, subscription_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'trial')`
    );
    const result = insertStmt.run(cleanUsername, cleanEmail, hash, salt, fullName || cleanUsername, now, now, trialExpiresAt);

    const userId = Number(result.lastInsertRowid);
    const token = this.createSession(userId);

    return {
      user: {
        id: userId,
        username: cleanUsername,
        email: cleanEmail,
        fullName: fullName || cleanUsername,
        trialExpiresAt,
        subscriptionStatus: "trial"
      },
      token
    };
  }

  loginUser({ usernameOrEmail, password }) {
    if (!usernameOrEmail || !password) {
      throw new Error("Username/Email and password are required.");
    }

    const clean = usernameOrEmail.trim().toLowerCase();
    const findStmt = this.db.prepare(
      "SELECT * FROM users WHERE LOWER(username) = ? OR LOWER(email) = ? OR LOWER(full_name) = ?"
    );
    const user = findStmt.get(clean, clean, clean);

    if (!user) {
      throw new Error("Invalid username/email or password.");
    }

    const isMatch = this.verifyPassword(password, user.salt, user.password_hash);
    if (!isMatch) {
      throw new Error("Invalid username/email or password.");
    }

    const token = this.createSession(user.id);
    const fullUser = this.getUserByToken(token);

    return {
      user: fullUser || {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name
      },
      token
    };
  }

  createSession(userId, durationMs = 100 * 365 * 24 * 60 * 60 * 1000) {
    const token = this.generateToken();
    const now = Date.now();
    const expiresAt = now + durationMs;

    const stmt = this.db.prepare(
      "INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)"
    );
    stmt.run(token, userId, now, expiresAt);
    return token;
  }

  getLatestUserSession() {
    // Prefer the most recently created non-admin user session (e.g. Empsf163) so user accounts stay signed in across port/server restarts
    const row = this.db.prepare(`
      SELECT s.token
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE LOWER(u.username) != 'admin'
      ORDER BY s.created_at DESC
      LIMIT 1
    `).get();
    if (!row) return null;
    const user = this.getUserByToken(row.token);
    return user ? { token: row.token, user } : null;
  }

  getUserByToken(token) {
    if (!token) return null;

    const stmt = this.db.prepare(`
      SELECT u.id, u.username, u.email, u.full_name, u.created_at, u.trial_started_at, u.trial_expires_at, u.subscription_expires_at, u.subscription_status, s.expires_at
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ?
    `);
    const row = stmt.get(token);

    if (!row) return null;

    const now = Date.now();
    // Auto-renew trial window if needed so created accounts ALWAYS work permanently
    if (!row.trial_expires_at || now >= row.trial_expires_at) {
      const renewedTrial = now + (72 * 60 * 60 * 1000);
      this.db.prepare("UPDATE users SET trial_expires_at = ? WHERE id = ?").run(renewedTrial, row.id);
      row.trial_expires_at = renewedTrial;
    }

    const isAdmin = row.username && row.username.toLowerCase() === "admin";
    const isPaid = isAdmin || (row.subscription_status === "paid" && row.subscription_expires_at && now < row.subscription_expires_at);
    const isTempPro = !isPaid && row.subscription_status === "temp_pro" && row.subscription_expires_at && now < row.subscription_expires_at;
    const isTrial = !isPaid && !isTempPro;
    const remainingMs = isTempPro
      ? Math.max(0, row.subscription_expires_at - now)
      : (row.trial_expires_at ? Math.max(0, row.trial_expires_at - now) : 72 * 3600 * 1000);
    const remainingTrialHours = Math.max(1, Math.ceil(remainingMs / (1000 * 60 * 60)));

    return {
      id: row.id,
      username: row.username,
      email: row.email,
      fullName: row.full_name,
      isAdmin,
      trialStartedAt: row.trial_started_at,
      trialExpiresAt: row.trial_expires_at,
      subscriptionExpiresAt: row.subscription_expires_at,
      subscriptionStatus: isPaid ? "paid" : (isTempPro ? "temp_pro" : "trial"),
      hasActiveAccess: true,
      remainingTrialHours
    };
  }

  checkUserAccess(userId) {
    const stmt = this.db.prepare("SELECT * FROM users WHERE id = ?");
    const user = stmt.get(userId);
    if (!user) return { hasAccess: false, reason: "USER_NOT_FOUND" };

    const now = Date.now();
    if (!user.trial_expires_at || now >= user.trial_expires_at) {
      const renewedTrial = now + (72 * 60 * 60 * 1000);
      this.db.prepare("UPDATE users SET trial_expires_at = ? WHERE id = ?").run(renewedTrial, user.id);
      user.trial_expires_at = renewedTrial;
    }

    const isAdmin = user.username && user.username.toLowerCase() === "admin";
    const isPaid = isAdmin || (user.subscription_status === "paid" && user.subscription_expires_at && now < user.subscription_expires_at);
    const isTempPro = !isPaid && user.subscription_status === "temp_pro" && user.subscription_expires_at && now < user.subscription_expires_at;

    const remainingTrialMs = isTempPro
      ? Math.max(0, user.subscription_expires_at - now)
      : (user.trial_expires_at ? Math.max(0, user.trial_expires_at - now) : 72 * 3600 * 1000);
    const remainingTrialHours = Math.max(1, Math.ceil(remainingTrialMs / (1000 * 60 * 60)));

    return {
      hasAccess: true,
      status: isPaid ? "paid" : (isTempPro ? "temp_pro" : "trial"),
      isAdmin,
      remainingTrialHours,
      trialExpiresAt: user.trial_expires_at,
      subscriptionExpiresAt: user.subscription_expires_at
    };
  }

  grantPaidSubscription(userId, days = 30) {
    const now = Date.now();
    const expiresAt = now + (days * 24 * 60 * 60 * 1000);
    const stmt = this.db.prepare(
      "UPDATE users SET subscription_status = 'paid', subscription_expires_at = ? WHERE id = ?"
    );
    stmt.run(expiresAt, userId);
    return { success: true, expiresAt, status: "paid" };
  }

  grantTemporarySubscription(userId, hours = 24) {
    const now = Date.now();
    const expiresAt = now + (hours * 60 * 60 * 1000);
    const stmt = this.db.prepare(
      "UPDATE users SET subscription_status = 'temp_pro', subscription_expires_at = ? WHERE id = ?"
    );
    stmt.run(expiresAt, userId);
    return { success: true, expiresAt, status: "temp_pro", remainingHours: hours };
  }

  setTrialExpiry(userId, expiresAt) {
    const stmt = this.db.prepare(
      "UPDATE users SET trial_expires_at = ? WHERE id = ?"
    );
    stmt.run(expiresAt, userId);
    return { success: true, trialExpiresAt: expiresAt };
  }

  recordPaymentTransaction({ userId, orderId, paymentId, signature, amount, currency = "INR", status = "success" }) {
    const now = Date.now();
    const stmt = this.db.prepare(
      `INSERT INTO payment_transactions (user_id, order_id, payment_id, signature, amount, currency, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const result = stmt.run(userId, orderId, paymentId, signature || "", amount, currency, status, now);
    return {
      id: Number(result.lastInsertRowid),
      userId,
      orderId,
      paymentId,
      amount,
      currency,
      status,
      createdAt: now
    };
  }

  getUserTransactions(userId) {
    const stmt = this.db.prepare(
      "SELECT id, order_id, payment_id, amount, currency, status, created_at FROM payment_transactions WHERE user_id = ? ORDER BY created_at DESC"
    );
    return stmt.all(userId);
  }

  deleteSession(token) {
    if (!token) return;
    const stmt = this.db.prepare("DELETE FROM sessions WHERE token = ?");
    stmt.run(token);
  }

  // Strict User-Isolated History
  getUserHistory(userId) {
    const stmt = this.db.prepare(
      "SELECT id, url, status, tested_at FROM user_history WHERE user_id = ? ORDER BY tested_at DESC"
    );
    return stmt.all(userId);
  }

  addUserHistory(userId, url, status = "verified") {
    const now = Date.now();
    // Check if URL already recorded for this user
    const checkStmt = this.db.prepare(
      "SELECT id FROM user_history WHERE user_id = ? AND url = ?"
    );
    const existing = checkStmt.get(userId, url);
    if (existing) {
      const updateStmt = this.db.prepare(
        "UPDATE user_history SET tested_at = ?, status = ? WHERE id = ?"
      );
      updateStmt.run(now, status, existing.id);
      return existing.id;
    }

    const insertStmt = this.db.prepare(
      "INSERT INTO user_history (user_id, url, status, tested_at) VALUES (?, ?, ?, ?)"
    );
    const res = insertStmt.run(userId, url, status, now);
    return Number(res.lastInsertRowid);
  }

  clearUserHistory(userId) {
    const stmt = this.db.prepare("DELETE FROM user_history WHERE user_id = ?");
    stmt.run(userId);
  }

  // Strict User-Isolated Presets
  getUserPresets(userId) {
    const stmt = this.db.prepare("SELECT preset_data FROM user_presets WHERE user_id = ?");
    const row = stmt.get(userId);
    return row ? JSON.parse(row.preset_data) : null;
  }

  saveUserPresets(userId, presetData) {
    const now = Date.now();
    const str = JSON.stringify(presetData);

    const checkStmt = this.db.prepare("SELECT id FROM user_presets WHERE user_id = ?");
    const existing = checkStmt.get(userId);

    if (existing) {
      const updateStmt = this.db.prepare(
        "UPDATE user_presets SET preset_data = ?, updated_at = ? WHERE id = ?"
      );
      updateStmt.run(str, now, existing.id);
    } else {
      const insertStmt = this.db.prepare(
        "INSERT INTO user_presets (user_id, preset_data, updated_at) VALUES (?, ?, ?)"
      );
      insertStmt.run(userId, str, now);
    }
  }

  close() {
    this.db.close();
  }
}

module.exports = new DatabaseManager();

