/**
 * Universal Scroll Compare Pro - Express & WebSocket Remote Browser Backend
 */

require("dotenv").config();
const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto");
const browserManager = require("./src/browser-manager");
const db = require("./src/database");

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws/sync" });

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Authentication Middleware
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required. Please sign in." });
  }

  const token = authHeader.split(" ")[1];
  const user = db.getUserByToken(token);
  if (!user) {
    return res.status(401).json({ error: "Session expired or invalid. Please sign in again." });
  }

  req.user = user;
  req.token = token;
  next();
}

// Subscription Enforcement Middleware (Backend-Enforced: Tabs cannot cheat expiry)
function requireActiveSubscription(req, res, next) {
  requireAuth(req, res, () => {
    if (!req.user.hasActiveAccess) {
      return res.status(403).json({
        error: "Your 3-day free trial has expired. Subscribe for ₹399/month to continue testing websites.",
        code: "SUBSCRIPTION_EXPIRED",
        subscriptionStatus: req.user.subscriptionStatus,
        trialExpiresAt: req.user.trialExpiresAt,
        remainingTrialHours: 0
      });
    }
    next();
  });
}

/* ==========================================================================
   User Authentication & Data Isolation Endpoints
   ========================================================================== */

// Register User
app.post("/api/auth/register", (req, res) => {
  try {
    const { username, email, password, confirmPassword, fullName } = req.body;
    if (confirmPassword !== undefined && confirmPassword !== null && password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }
    const result = db.registerUser({ username, email, password, fullName });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login User
app.post("/api/auth/login", (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const result = db.loginUser({ usernameOrEmail, password });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Current User Profile
app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Restore Latest Active User Session (Preserves user login across port switches / server restarts)
app.get("/api/auth/session-restore", (req, res) => {
  try {
    const active = db.getLatestUserSession();
    if (active && active.user && active.token) {
      return res.json({ success: true, token: active.token, user: active.user });
    }
    res.json({ success: false });
  } catch (e) {
    res.json({ success: false });
  }
});

// Logout User
app.post("/api/auth/logout", requireAuth, (req, res) => {
  db.deleteSession(req.token);
  res.json({ success: true });
});

// Get User-Isolated History
app.get("/api/user/history", requireAuth, (req, res) => {
  const history = db.getUserHistory(req.user.id);
  res.json({ success: true, history });
});

// Add History Entry (Strictly isolated by user_id)
app.post("/api/user/history", requireAuth, (req, res) => {
  const { url, status } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });
  const id = db.addUserHistory(req.user.id, url, status || "verified");
  res.json({ success: true, id });
});

// Clear History for Current User Only
app.delete("/api/user/history", requireAuth, (req, res) => {
  db.clearUserHistory(req.user.id);
  res.json({ success: true });
});

// Get User-Isolated Presets
app.get("/api/user/presets", requireAuth, (req, res) => {
  const presets = db.getUserPresets(req.user.id);
  res.json({ success: true, presets });
});

// Save User Presets
app.post("/api/user/presets", requireAuth, (req, res) => {
  const { presets } = req.body;
  db.saveUserPresets(req.user.id, presets);
  res.json({ success: true });
});

// Subscription Status Endpoint
app.get("/api/subscription/status", requireAuth, (req, res) => {
  const access = db.checkUserAccess(req.user.id);
  res.json({ success: true, user: req.user, subscription: access });
});

// Admin-Only Grant Paid Access Endpoint (Requires configured ADMIN_SECRET)
app.post("/api/subscription/grant-access", requireAuth, (req, res) => {
  const { days, adminSecret } = req.body;
  if (!process.env.ADMIN_SECRET || !adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({
      error: "Unauthorized: Direct subscription activation requires administrator authorization."
    });
  }
  const result = db.grantPaidSubscription(req.user.id, parseInt(days, 10) || 30);
  res.json({ success: true, ...result });
});

/* ==========================================================================
   Strict Payment & Pro License Verification (No Auto-Approval Bypass)
   ========================================================================== */

function verifyProLicenseKey(user, rawKey) {
  if (!rawKey || typeof rawKey !== "string") return false;
  const cleanKey = rawKey.trim();
  if (cleanKey.length < 10) return false;

  // 1. Check against explicit master key in .env if configured by owner
  if (process.env.PRO_LICENSE_MASTER_KEY && cleanKey === process.env.PRO_LICENSE_MASTER_KEY.trim()) {
    return true;
  }

  // 2. Check cryptographic HMAC-signed per-user license key: SFPRO-<8-char-hmac>
  const signingSecret = process.env.PRO_LICENSE_SIGNING_SECRET;
  if (signingSecret && user) {
    const expectedHmac = crypto
      .createHmac("sha256", signingSecret)
      .update(`${user.username.toLowerCase()}|${user.email.toLowerCase()}|PRO399`)
      .digest("hex")
      .substring(0, 12)
      .toUpperCase();
    const expectedKey = `SFPRO-${expectedHmac}`;
    if (cleanKey.toUpperCase() === expectedKey) {
      return true;
    }
  }

  return false;
}

// Create Payment Order for ₹399 / month (39900 paise)
app.post("/api/payment/create-order", requireAuth, (req, res) => {
  try {
    const amount = 39900; // ₹399 in paise
    const currency = "INR";
    const receipt = `rcpt_${req.user.id}_${Date.now()}`;
    const orderId = `order_${crypto.randomBytes(8).toString("hex")}`;
    const hasLiveGateway = !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

    res.json({
      success: true,
      hasLiveGateway,
      order: {
        id: orderId,
        amount,
        currency,
        receipt,
        plan: "Universal Scroll Compare Pro (30 Days)",
        keyId: process.env.RAZORPAY_KEY_ID || null
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Strict Payment & Admin / Temporary Upgrade Verification Endpoint
app.post("/api/payment/verify", requireAuth, (req, res) => {
  try {
    const { mode, adminUsername, adminPassword, orderId, paymentId, signature, licenseKey, utrNumber } = req.body;

    const isCurrentUserAdmin = req.user.username && req.user.username.toLowerCase() === "admin";

    // Path 1: Temporary Pro Upgrade for Remaining Users (24-Hour Temporary Pro Access)
    if (mode === "temporary" && !isCurrentUserAdmin) {
      const tempResult = db.grantTemporarySubscription(req.user.id, 24);
      const updatedAccess = db.checkUserAccess(req.user.id);
      return res.json({
        success: true,
        verified: true,
        isTemporary: true,
        subscriptionStatus: "temp_pro",
        message: "Temporary Pro Access (24h) activated for testing!",
        subscription: updatedAccess,
        expiresAt: tempResult.expiresAt
      });
    }

    // Path 2: Permanent Pro Plan Activation (Strictly requires Admin Account or Admin Credentials: admin / admin@26SF)
    let isAdminAuthorized = isCurrentUserAdmin;
    if (!isAdminAuthorized && adminUsername && adminPassword) {
      isAdminAuthorized = db.verifyAdminCredentials(adminUsername, adminPassword);
    }

    if (!isAdminAuthorized && licenseKey && utrNumber && String(utrNumber).trim().length >= 6) {
      isAdminAuthorized = verifyProLicenseKey(req.user, licenseKey);
    }

    if (!isAdminAuthorized) {
      return res.status(403).json({
        error: "Permanent Pro Plan upgrade is restricted to the Admin account (admin). Remaining users can use 'Activate Temporary Pro Access' below."
      });
    }

    // Record verified admin authorization in database
    db.recordPaymentTransaction({
      userId: req.user.id,
      orderId: orderId || `adm_${Date.now()}`,
      paymentId: paymentId || utrNumber || "admin_approved",
      signature: signature || "admin_verified_26SF",
      amount: 39900,
      currency: "INR",
      status: "success"
    });

    // Grant full permanent/30-day paid Pro subscription
    const subResult = db.grantPaidSubscription(req.user.id, isCurrentUserAdmin ? 36500 : 30);
    const updatedAccess = db.checkUserAccess(req.user.id);

    res.json({
      success: true,
      verified: true,
      isTemporary: false,
      subscriptionStatus: "paid",
      message: "Admin verification successful! Permanent Pro Plan activated.",
      subscription: updatedAccess,
      expiresAt: subResult.expiresAt
    });
  } catch (err) {
    console.error("[Payment] Verification error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Download Standalone Portable Windows .exe from the Online Web Application
app.get("/api/download/exe", (req, res) => {
  const fs = require("fs");
  const exePath = path.join(__dirname, "dist-portable-exe", "ResponsiveCompare-Portable.exe");
  if (fs.existsSync(exePath)) {
    return res.download(exePath, "ResponsiveCompare-Portable.exe");
  }
  res.status(404).json({
    error: "Portable .exe package is currently being built. Run 'npm run portable' to generate dist-portable-exe/ResponsiveCompare-Portable.exe."
  });
});

// Get Shareable Online & Local Network URLs + Cross-Platform App Info
app.get("/api/network-info", (req, res) => {
  const os = require("os");
  const fs = require("fs");
  const nets = os.networkInterfaces();
  let lanIp = "127.0.0.1";
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        lanIp = net.address;
        break;
      }
    }
  }
  let publicUrl = process.env.PUBLIC_APP_URL || null;
  const pubUrlFile = path.join(__dirname, ".public-url.txt");
  if (!publicUrl && fs.existsSync(pubUrlFile)) {
    try {
      const saved = fs.readFileSync(pubUrlFile, "utf8").trim();
      if (saved.startsWith("http")) publicUrl = saved;
    } catch (e) {}
  }
  const exePath = path.join(__dirname, "dist-portable-exe", "ResponsiveCompare-Portable.exe");
  res.json({
    localUrl: `http://localhost:${PORT}`,
    lanUrl: `http://${lanIp}:${PORT}`,
    publicUrl: publicUrl,
    exeAvailable: fs.existsSync(exePath)
  });
});

// Webhook for Asynchronous Payment Confirmation
app.post("/api/payment/webhook", (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const webhookSignature = req.headers["x-razorpay-signature"];

    if (webhookSecret && webhookSignature) {
      const generated = crypto
        .createHmac("sha256", webhookSecret)
        .update(JSON.stringify(req.body))
        .digest("hex");
      if (generated !== webhookSignature) {
        return res.status(400).json({ error: "Invalid webhook signature" });
      }
    }

    const event = req.body.event;
    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = req.body.payload?.payment?.entity;
      const userId = paymentEntity?.notes?.userId;
      if (userId) {
        db.grantPaidSubscription(userId, 30);
        db.recordPaymentTransaction({
          userId: Number(userId),
          orderId: paymentEntity.order_id || "webhook_order",
          paymentId: paymentEntity.id || "webhook_pay",
          signature: webhookSignature || "",
          amount: paymentEntity.amount || 39900,
          currency: paymentEntity.currency || "INR",
          status: "success"
        });
      }
    }

    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Payment History Endpoint
app.get("/api/payment/history", requireAuth, (req, res) => {
  try {
    const transactions = db.getUserTransactions(req.user.id);
    res.json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health & Engine Status
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    browser: browserManager.getStatus(),
    timestamp: Date.now()
  });
});

// Configure or switch browser mode (local vs cloud Browserless.io)
app.post("/api/settings/browser-mode", requireAuth, (req, res) => {
  try {
    const { mode, apiKey } = req.body;
    if (!["local", "docker", "cloud"].includes(mode)) {
      return res.status(400).json({ error: "Invalid mode. Must be 'local', 'docker', or 'cloud'." });
    }
    const status = browserManager.setMode(mode, apiKey);
    res.json({ success: true, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Live Interactive Website Proxy (Strips X-Frame-Options/CSP & Injects Scroll-Sync + Interaction Bridge)
app.get("/api/proxy", async (req, res) => {
  const rawUrl = req.query.url;
  const vpIndex = parseInt(req.query.index || "0", 10);

  if (!rawUrl || typeof rawUrl !== "string" || !rawUrl.trim()) {
    return res.status(400).send(`<!DOCTYPE html><html><body style="font-family:Inter,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#0f172a;color:#94a3b8;"><div style="text-align:center;"><h3 style="color:#f8fafc;margin-bottom:6px;">No URL Provided</h3><p style="font-size:13px;margin:0;">Please enter a valid website URL in the address bar above.</p></div></body></html>`);
  }

  let targetUrl = rawUrl.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = "https://" + targetUrl;
  }

  try {
    const parsedTarget = new URL(targetUrl);
    // If targetUrl points to our own proxy, unwrap it
    if (parsedTarget.pathname === "/api/proxy" && parsedTarget.searchParams.get("url")) {
      targetUrl = parsedTarget.searchParams.get("url");
    }
  } catch (urlErr) {
    return res.status(400).send(`<!DOCTYPE html><html><body style="font-family:Inter,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#0f172a;color:#f87171;"><div style="text-align:center;"><h3>Invalid URL Format</h3><p style="font-size:13px;color:#cbd5e1;">Could not parse URL: ${rawUrl.replace(/[<>"'&]/g, "")}</p></div></body></html>`);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000);

    const response = await fetch(targetUrl, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });
    clearTimeout(timeoutId);

    const finalUrl = response.url || targetUrl;
    const parsedFinal = new URL(finalUrl);
    let baseHref = finalUrl;
    if (!parsedFinal.pathname.endsWith("/")) {
      const lastSeg = parsedFinal.pathname.split("/").pop() || "";
      if (!lastSeg.includes(".")) {
        baseHref = `${parsedFinal.origin}${parsedFinal.pathname}/${parsedFinal.search}`;
      } else {
        const dirPath = parsedFinal.pathname.substring(0, parsedFinal.pathname.lastIndexOf("/") + 1);
        baseHref = `${parsedFinal.origin}${dirPath}`;
      }
    }

    const contentType = response.headers.get("content-type") || "text/html; charset=utf-8";

    // Allow full framing and cross-origin access
    res.removeHeader("X-Frame-Options");
    res.removeHeader("Content-Security-Policy");
    res.removeHeader("Content-Security-Policy-Report-Only");
    res.setHeader("Access-Control-Allow-Origin", "*");

    if (!contentType.toLowerCase().includes("text/html") && !contentType.toLowerCase().includes("application/xhtml+xml")) {
      res.setHeader("Content-Type", contentType);
      const arrayBuffer = await response.arrayBuffer();
      return res.send(Buffer.from(arrayBuffer));
    }

    let html = await response.text();

    // Strip any meta CSP or X-Frame-Options tags inside the HTML
    html = html
      .replace(/<meta[^>]+http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi, "")
      .replace(/<meta[^>]+http-equiv=["']?X-Frame-Options["']?[^>]*>/gi, "");

    const bridgeScript = `
<base href="${baseHref}">
<script>
(function() {
  var vpIndex = ${vpIndex};
  var isProgrammaticScroll = false;
  var isProgrammaticClick = false;
  var scrollUnlockTimer = null;

  // Guard History API against cross-origin <base> SecurityError & rewrite #hash URLs to local proxy URL
  try {
    var origPush = history.pushState;
    var origReplace = history.replaceState;
    function normalizeHistoryUrl(u) {
      if (typeof u === 'string' && u.startsWith('#')) {
        return window.location.pathname + window.location.search + u;
      }
      return u;
    }
    history.pushState = function(state, title, url) {
      try {
        var args = Array.prototype.slice.call(arguments);
        if (args.length >= 3) args[2] = normalizeHistoryUrl(args[2]);
        return origPush.apply(this, args);
      } catch (e) {}
    };
    history.replaceState = function(state, title, url) {
      try {
        var args = Array.prototype.slice.call(arguments);
        if (args.length >= 3) args[2] = normalizeHistoryUrl(args[2]);
        return origReplace.apply(this, args);
      } catch (e) {}
    };
  } catch (e) {}

  function getScrollMetrics() {
    var doc = document.documentElement;
    var body = document.body;
    var scrollH = Math.max(
      doc ? doc.scrollHeight : 0,
      body ? body.scrollHeight : 0,
      doc ? doc.offsetHeight : 0,
      body ? body.offsetHeight : 0
    );
    var clientH = window.innerHeight || (doc ? doc.clientHeight : 0) || 1;
    var maxScroll = Math.max(1, scrollH - clientH);
    var currentY = window.scrollY || window.pageYOffset || (doc ? doc.scrollTop : 0) || (body ? body.scrollTop : 0) || 0;
    var progress = Math.max(0, Math.min(1, currentY / maxScroll));
    if (currentY <= 2) progress = 0;
    else if (maxScroll - currentY <= 4) progress = 1;
    return { scrollH: scrollH, clientH: clientH, maxScroll: maxScroll, currentY: currentY, progress: progress };
  }

  function getCssPath(el) {
    if (!el || el.nodeType !== 1) return '';
    if (el.id) return '#' + CSS.escape(el.id);
    var parts = [];
    var cur = el;
    while (cur && cur.nodeType === 1 && cur !== document.body && cur !== document.documentElement) {
      if (cur.id) {
        parts.unshift('#' + CSS.escape(cur.id));
        break;
      }
      var tag = cur.tagName.toLowerCase();
      var parent = cur.parentElement;
      if (parent) {
        var siblings = [];
        for (var i = 0; i < parent.children.length; i++) {
          if (parent.children[i].tagName === cur.tagName) siblings.push(parent.children[i]);
        }
        if (siblings.length > 1) {
          tag += ':nth-of-type(' + (siblings.indexOf(cur) + 1) + ')';
        }
      }
      parts.unshift(tag);
      cur = parent;
    }
    return parts.join(' > ');
  }

  function buildClickDescriptor(el) {
    if (!el || el.nodeType !== 1) return null;
    return {
      id: el.id || '',
      tagName: (el.tagName || '').toLowerCase(),
      href: (el.getAttribute && el.getAttribute('href')) || '',
      dataPage: (el.dataset && (el.dataset.page || el.dataset.tab || el.dataset.target || el.dataset.view)) || '',
      ariaLabel: (el.getAttribute && el.getAttribute('aria-label')) || '',
      text: ((el.innerText || el.textContent || '').trim().replace(/\\s+/g, ' ')).slice(0, 80),
      selectorPath: getCssPath(el)
    };
  }

  function findElementFromDescriptor(d) {
    if (!d) return null;
    if (d.id) {
      var byId = document.getElementById(d.id);
      if (byId) return byId;
    }
    if (d.dataPage) {
      var byData = document.querySelector('[data-page="' + CSS.escape(d.dataPage) + '"], [data-tab="' + CSS.escape(d.dataPage) + '"], [data-target="' + CSS.escape(d.dataPage) + '"], [data-view="' + CSS.escape(d.dataPage) + '"]');
      if (byData) return byData;
    }
    if (d.href) {
      var byHref = document.querySelector('a[href="' + CSS.escape(d.href) + '"]');
      if (byHref) return byHref;
    }
    if (d.selectorPath) {
      try {
        var byPath = document.querySelector(d.selectorPath);
        if (byPath) return byPath;
      } catch (e) {}
    }
    if (d.tagName && d.text) {
      var candidates = document.querySelectorAll(d.tagName);
      for (var i = 0; i < candidates.length; i++) {
        var txt = ((candidates[i].innerText || candidates[i].textContent || '').trim().replace(/\\s+/g, ' ')).slice(0, 80);
        if (txt === d.text) return candidates[i];
      }
    }
    return null;
  }

  // Synchronize user scroll with all other device viewports
  window.addEventListener('scroll', function() {
    if (isProgrammaticScroll) return;
    var m = getScrollMetrics();
    window.parent.postMessage({
      type: 'USC_IFRAME_SCROLL',
      index: vpIndex,
      progress: m.progress,
      scrollY: m.currentY,
      maxScroll: m.maxScroll,
      scrollHeight: m.scrollH
    }, '*');
  }, { passive: true });

  // Receive synchronized scroll and click commands from parent workspace
  window.addEventListener('message', function(e) {
    if (!e.data || typeof e.data !== 'object') return;
    if (e.data.type === 'USC_SYNC_TO') {
      isProgrammaticScroll = true;
      clearTimeout(scrollUnlockTimer);
      var m = getScrollMetrics();
      var targetY = e.data.mode === 'pixel'
        ? e.data.scrollY
        : Math.round(e.data.progress * m.maxScroll);
      if (e.data.progress <= 0.001 && e.data.mode !== 'pixel') targetY = 0;
      if (e.data.progress >= 0.999 && e.data.mode !== 'pixel') targetY = m.maxScroll;

      var docEl = document.documentElement;
      var prevBehavior = docEl ? docEl.style.scrollBehavior : '';
      if (docEl) docEl.style.scrollBehavior = 'auto';
      window.scrollTo(0, targetY);
      if (docEl) docEl.style.scrollBehavior = prevBehavior;

      scrollUnlockTimer = setTimeout(function() {
        isProgrammaticScroll = false;
      }, 65);
    } else if (e.data.type === 'USC_WHEEL_DELTA') {
      window.scrollBy(0, e.data.deltaY || 0);
    } else if (e.data.type === 'USC_REPLAY_CLICK') {
      var targetEl = findElementFromDescriptor(e.data.descriptor);
      if (targetEl) {
        isProgrammaticClick = true;
        try {
          targetEl.click();
        } catch (err) {}
        setTimeout(function() {
          isProgrammaticClick = false;
        }, 50);
      }
    }
  });

  // Synchronize interactive clicks (hamburger menu, nav links, tabs, buttons) and multi-page redirects across all devices
  document.addEventListener('click', function(e) {
    var clickable = (e.target && e.target.closest)
      ? (e.target.closest('a, button, [role="button"], [data-page], [data-tab], [onclick], input[type="submit"], input[type="button"], summary') || e.target)
      : e.target;

    var a = (e.target && e.target.closest) ? e.target.closest('a[href]') : null;
    var rawHref = a ? (a.getAttribute('href') || '').trim() : '';

    // 1. Broadcast user click to all other device viewports
    if (!isProgrammaticClick && clickable) {
      var desc = buildClickDescriptor(clickable);
      if (desc) {
        window.parent.postMessage({
          type: 'USC_IFRAME_CLICK',
          index: vpIndex,
          descriptor: desc
        }, '*');
      }
    }

    // 2. Handle anchor navigation safely inside the proxy
    if (!a || !rawHref) return;
    var lowerHref = rawHref.toLowerCase();
    if (lowerHref.startsWith('javascript:') || lowerHref.startsWith('mailto:') || lowerHref.startsWith('tel:')) {
      return;
    }

    if (rawHref.startsWith('#')) {
      // If the page's own SPA script already called e.preventDefault() (e.g. Table & Tale showPage), let it finish
      if (e.defaultPrevented) return;
      // Otherwise prevent <base href> from reloading cross-origin and smoothly scroll to the section
      e.preventDefault();
      if (rawHref === '#' || rawHref === '#top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      try {
        var sectionEl = document.querySelector(rawHref) || document.getElementById(rawHref.slice(1));
        if (sectionEl) {
          sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } catch (err) {}
      return;
    }

    if (a.target === '_blank' || a.hasAttribute('download')) return;
    if (e.defaultPrevented) return;

    try {
      var resolved = new URL(rawHref, "${baseHref}").href;
      if (/^https?:\\/\\//i.test(resolved)) {
        e.preventDefault();
        if (!isProgrammaticClick) {
          window.parent.postMessage({
            type: 'USC_IFRAME_NAVIGATE',
            index: vpIndex,
            url: resolved
          }, '*');
        } else {
          window.location.href = '/api/proxy?url=' + encodeURIComponent(resolved) + '&index=' + vpIndex;
        }
      }
    } catch (err) {}
  }, false);
})();
</script>`;

    if (/<head[^>]*>/i.test(html)) {
      html = html.replace(/<head[^>]*>/i, match => `${match}\n${bridgeScript}`);
    } else if (/<html[^>]*>/i.test(html)) {
      html = html.replace(/<html[^>]*>/i, match => `${match}\n<head>${bridgeScript}</head>`);
    } else {
      html = bridgeScript + "\n" + html;
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (err) {
    res.status(502).send(`<!DOCTYPE html><html><body style="font-family:Inter,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#0f172a;color:#f8fafc;padding:24px;box-sizing:border-box;"><div style="max-width:420px;text-align:center;background:#1e293b;border:1px solid #334155;border-radius:12px;padding:24px;"><h3 style="margin:0 0 8px;color:#f87171;">Unable to Load Website</h3><p style="font-size:13px;color:#cbd5e1;line-height:1.5;margin:0 0 12px;">Could not reach <strong>${targetUrl.replace(/[<>"'&]/g, "")}</strong> (${err.message || "Network error"}).</p><small style="color:#94a3b8;">Check that the URL is spelled properly and publicly accessible.</small></div></body></html>`);
  }
});

// Start a new multi-viewport remote browser session (Strictly requires active trial or subscription)
app.post("/api/session/start", requireActiveSubscription, async (req, res) => {
  try {
    const { targetUrl, viewports } = req.body;
    if (!targetUrl) {
      return res.status(400).json({ error: "targetUrl is required" });
    }

    const sessionId = "sess_" + Math.random().toString(36).substring(2, 9);
    const defaultViewports = viewports || [
      { name: "iPhone 15 Pro", width: 393, height: 852, isMobile: true },
      { name: "iPad Pro 11\"", width: 834, height: 1194, isMobile: false },
      { name: "Desktop 1080p", width: 1920, height: 1080, isMobile: false }
    ];

    const session = await browserManager.createSession({
      sessionId,
      targetUrl,
      viewports: defaultViewports
    });

    const responseViewports = session.viewports.map(v => ({
      index: v.index,
      name: v.name,
      width: v.width,
      height: v.height,
      metrics: v.metrics,
      initialFrameBase64: v.initialFrameBase64 || null
    }));

    res.json({
      success: true,
      sessionId,
      targetUrl,
      viewports: responseViewports
    });
  } catch (err) {
    console.error("[Server] Error starting session:", err);
    res.status(500).json({ error: err.message });
  }
});

// Synchronize scroll position across viewports (Requires active subscription)
app.post("/api/session/scroll", requireActiveSubscription, async (req, res) => {
  try {
    const { sessionId, sourceIndex, progress, scrollY, mode } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }

    const updatedViewports = await browserManager.syncScroll({
      sessionId,
      sourceIndex: Number(sourceIndex) || 0,
      progress: Number(progress) || 0,
      scrollY: Number(scrollY) || 0,
      mode: mode || "percentage"
    });

    res.json({
      success: true,
      sessionId,
      viewports: updatedViewports
    });
  } catch (err) {
    console.error("[Server] Error syncing scroll:", err);
    res.status(500).json({ error: err.message });
  }
});

// Capture a frame for a specific viewport (Requires active subscription)
app.get("/api/session/:sessionId/frame/:viewportIndex", requireActiveSubscription, async (req, res) => {
  try {
    const { sessionId, viewportIndex } = req.params;
    const format = req.query.format || "image"; // "image" or "json"

    const frameData = await browserManager.captureFrame({
      sessionId,
      viewportIndex: parseInt(viewportIndex, 10),
      quality: parseInt(req.query.q, 10) || 75
    });

    if (format === "json") {
      return res.json({
        success: true,
        index: frameData.index,
        metrics: frameData.metrics,
        base64: frameData.base64
      });
    }

    res.set("Content-Type", "image/jpeg");
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.send(frameData.imageBuffer);
  } catch (err) {
    console.error("[Server] Error capturing frame:", err);
    res.status(500).json({ error: err.message });
  }
});

// Stop session
app.post("/api/session/stop", async (req, res) => {
  try {
    const { sessionId } = req.body;
    const closed = await browserManager.closeSession(sessionId);
    res.json({ success: true, closed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// WebSocket Handling for sub-millisecond scroll events
wss.on("connection", (ws) => {
  console.log("[WS] Client connected to /ws/sync");

  ws.on("message", async (data) => {
    try {
      const msg = JSON.parse(data.toString());

      if (msg.type === "SCROLL") {
        const { sessionId, sourceIndex, progress, scrollY, mode } = msg;
        const results = await browserManager.syncScroll({
          sessionId,
          sourceIndex,
          progress,
          scrollY,
          mode
        });

        ws.send(JSON.stringify({
          type: "SCROLL_ACK",
          sessionId,
          viewports: results
        }));
      } else if (msg.type === "REQUEST_FRAMES") {
        const { sessionId, viewportIndices } = msg;
        const frames = [];
        for (const idx of viewportIndices) {
          const f = await browserManager.captureFrame({
            sessionId,
            viewportIndex: idx,
            quality: 70
          });
          frames.push({
            index: idx,
            metrics: f.metrics,
            base64: f.base64
          });
        }
        ws.send(JSON.stringify({
          type: "FRAMES_BATCH",
          sessionId,
          frames
        }));
      }
    } catch (err) {
      ws.send(JSON.stringify({ type: "ERROR", message: err.message }));
    }
  });

  ws.on("close", () => {
    console.log("[WS] Client disconnected");
  });
});

if (require.main === module) {
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`=======================================================`);
    console.log(`🚀 Universal Scroll Compare Backend Running`);
    console.log(`📡 Local URL: http://localhost:${PORT}`);
    console.log(`🌐 Network URL: http://0.0.0.0:${PORT}`);
    console.log(`🔌 Mode: ${browserManager.mode.toUpperCase()}`);
    console.log(`⚡ WebSocket: ws://localhost:${PORT}/ws/sync`);
    console.log(`=======================================================`);
  });
}

module.exports = { app, server, browserManager };

