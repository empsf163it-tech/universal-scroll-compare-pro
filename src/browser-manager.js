/**
 * Universal Scroll Compare Pro - Remote Browser Manager
 * 
 * Supports:
 * 1. "cloud"  -> Remote Browserless.io service with server-side secret API key
 * 2. "docker" -> Local Browserless Docker container (ws://localhost:3000)
 * 3. "local"  -> Local Chrome / Edge execution via Puppeteer Core
 */

const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

class RemoteBrowserManager {
  constructor() {
    this.mode = process.env.BROWSER_MODE || "local";
    this.cloudApiKey = process.env.BROWSERLESS_API_KEY || "";
    this.browser = null;
    this.sessions = new Map();
  }

  setMode(newMode, apiKey) {
    if (["local", "docker", "cloud"].includes(newMode)) {
      this.mode = newMode;
      if (apiKey !== undefined) this.cloudApiKey = apiKey;
      // Reset current browser so next session connects using the new mode
      if (this.browser) {
        try { this.browser.disconnect(); } catch (e) {}
        this.browser = null;
      }
    }
    return this.getStatus();
  }

  getStatus() {
    return {
      mode: this.mode,
      configuredCloudToken: !!(this.cloudApiKey || process.env.BROWSERLESS_API_KEY),
      localChromeFound: !!this.detectLocalChrome(),
      localChromePath: this.detectLocalChrome(),
      activeSessions: this.sessions.size,
      connected: this.browser && (typeof this.browser.isConnected === "function" ? this.browser.isConnected() : this.browser.connected !== false)
    };
  }

  detectLocalChrome() {
    if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
      return process.env.CHROME_PATH;
    }
    const candidates = [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
      "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
      "/usr/bin/google-chrome",
      "/usr/bin/chromium-browser"
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) return p;
    }
    return null;
  }

  getBrowserlessEndpoint() {
    if (this.mode === "docker") {
      return process.env.BROWSERLESS_LOCAL_URL || "ws://localhost:3000";
    }
    if (this.mode === "cloud") {
      const baseUrl = process.env.BROWSERLESS_WS_ENDPOINT || "wss://chrome.browserless.io";
      const token = this.cloudApiKey || process.env.BROWSERLESS_API_KEY || "";
      if (!token) {
        throw new Error("BROWSERLESS_API_KEY is not defined in server environment (.env)");
      }
      return `${baseUrl}?token=${token}`;
    }
    return null;
  }

  async getBrowser() {
    const isAlive = this.browser && (typeof this.browser.isConnected === "function" ? this.browser.isConnected() : this.browser.connected !== false);
    if (isAlive) {
      return this.browser;
    }

    if (this.mode === "cloud" || this.mode === "docker") {
      try {
        const endpoint = this.getBrowserlessEndpoint();
        console.log(`[BrowserManager] Connecting to Browserless (${this.mode}): ${endpoint.replace(/token=([^&]+)/, "token=***")}`);
        this.browser = await puppeteer.connect({
          browserWSEndpoint: endpoint,
          defaultViewport: null
        });
      } catch (err) {
        console.warn(`[BrowserManager] Failed to connect to Browserless (${err.message}). Falling back to local browser...`);
        // Graceful fallback to local Chrome/Edge
        this.mode = "local";
        return await this.getBrowser();
      }
    } else {
      const chromePath = this.detectLocalChrome();
      if (!chromePath) {
        throw new Error("No local Chrome/Edge executable found on this system.");
      }
      console.log(`[BrowserManager] Launching local browser: ${chromePath}`);
      this.browser = await puppeteer.launch({
        executablePath: chromePath,
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-web-security",
          "--disable-features=IsolateOrigins,site-per-process",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--disable-blink-features=AutomationControlled",
          "--disable-infobars",
          "--ignore-certificate-errors",
          "--window-size=1920,1080"
        ]
      });
    }

    this.browser.on("disconnected", () => {
      console.warn("[BrowserManager] Browser disconnected.");
      this.browser = null;
    });

    return this.browser;
  }

  /**
   * Create a multi-viewport rendering session for a target URL
   */
  async createSession({ sessionId, targetUrl, viewports }) {
    const browser = await this.getBrowser();
    const context = await browser.createBrowserContext();

    // Concurrently initialize all viewports for maximum speed
    const viewportPages = await Promise.all(
      viewports.map(async (vp, i) => {
        const page = await context.newPage();

        // Configure viewport resolution and DPR
        await page.setViewport({
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: vp.deviceScaleFactor || 1,
          isMobile: !!vp.isMobile,
          hasTouch: !!vp.hasTouch
        });

        // Apply realistic user agent and stealth headers
        let userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36";
        if (vp.isMobile) {
          userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
        } else if (vp.name && vp.name.toLowerCase().includes("ipad")) {
          userAgent = "Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
        }
        await page.setUserAgent(userAgent);

        await page.setExtraHTTPHeaders({
          "Accept-Language": "en-US,en;q=0.9",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Sec-Ch-Ua": '"Chromium";v="129", "Not=A?Brand";v="8"',
          "Sec-Ch-Ua-Mobile": vp.isMobile ? "?1" : "?0",
          "Sec-Ch-Ua-Platform": vp.isMobile ? '"iOS"' : '"Windows"'
        });

        // Anti-automation evasion: Mask webdriver & mock browser features
        await page.evaluateOnNewDocument(() => {
          try {
            Object.defineProperty(navigator, "webdriver", {
              get: () => undefined
            });
          } catch (e) {}

          window.chrome = {
            runtime: {},
            loadTimes: function() {},
            csi: function() {},
            app: {}
          };

          try {
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => (
              parameters.name === "notifications" ?
                Promise.resolve({ state: Notification.permission }) :
                originalQuery(parameters)
            );
          } catch (e) {}

          Object.defineProperty(navigator, "plugins", {
            get: () => [1, 2, 3, 4, 5]
          });
          Object.defineProperty(navigator, "languages", {
            get: () => ["en-US", "en"]
          });
        });

        // Fast Turbo Asset Interception: Abort heavy non-essential media & tracking bloat
        try {
          await page.setRequestInterception(true);
          page.on("request", (req) => {
            const u = req.url().toLowerCase();
            const rType = req.resourceType();
            if (rType === "media" && (u.endsWith(".mp4") || u.endsWith(".webm") || u.endsWith(".ogg") || u.endsWith(".mp3"))) {
              return req.abort();
            }
            if (
              u.includes("google-analytics.com") ||
              u.includes("googletagmanager.com") ||
              u.includes("doubleclick.net") ||
              u.includes("facebook.net/tr") ||
              u.includes("hotjar.com") ||
              u.includes("clarity.ms") ||
              u.includes("criteo.net")
            ) {
              return req.abort();
            }
            req.continue();
          });
        } catch (e) {}

        // Navigate to target URL with fast 12s timeout
        console.log(`[BrowserManager] [Session ${sessionId}] Loading viewport ${i} (${vp.name || vp.width + 'x' + vp.height}) -> ${targetUrl}`);
        try {
          await page.goto(targetUrl, {
            waitUntil: "domcontentloaded",
            timeout: 12000
          });

          // Fast Anti-bot challenge check
          const isChallenged = await page.evaluate(() => {
            const bodyText = document.body ? document.body.innerText : "";
            const title = document.title || "";
            return (
              title.includes("Just a moment") ||
              title.includes("Attention Required") ||
              bodyText.includes("cf-challenge") ||
              bodyText.includes("Checking your browser")
            );
          });

          if (isChallenged) {
            console.warn(`[BrowserManager] Anti-bot challenge detected on viewport ${i}. Waiting 1.5s for challenge pass...`);
            await new Promise((r) => setTimeout(r, 1500));
          }
        } catch (err) {
          console.warn(`[BrowserManager] Navigation note for viewport ${i}: ${err.message}`);
        }

        const metrics = await this.getPageScrollMetrics(page);

        // Pre-capture initial frame in parallel so client doesn't need a second round trip
        let initialFrameBase64 = null;
        try {
          const buf = await page.screenshot({
            type: "jpeg",
            quality: 65
          });
          initialFrameBase64 = buf.toString("base64");
        } catch (e) {}

        return {
          index: i,
          name: vp.name,
          width: vp.width,
          height: vp.height,
          page,
          metrics,
          initialFrameBase64
        };
      })
    );

    const sessionData = {
      sessionId,
      targetUrl,
      context,
      viewports: viewportPages,
      createdAt: Date.now()
    };

    this.sessions.set(sessionId, sessionData);
    return sessionData;
  }

  async getPageScrollMetrics(page) {
    return await page.evaluate(() => {
      const root = document.scrollingElement || document.documentElement || document.body;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight;
      const scrollHeight = Math.max(
        root ? root.scrollHeight : 0,
        document.documentElement.scrollHeight,
        document.body ? document.body.scrollHeight : 0
      );
      const maxScroll = Math.max(1, scrollHeight - clientHeight);
      const currentY = window.scrollY || (root ? root.scrollTop : 0) || 0;
      const progress = maxScroll > 0 ? currentY / maxScroll : 0;

      return {
        title: document.title,
        scrollHeight,
        clientHeight,
        maxScroll,
        currentY,
        progress
      };
    });
  }

  /**
   * Synchronize scroll across all viewports in a session
   */
  async syncScroll({ sessionId, sourceIndex, progress, scrollY, mode = "percentage" }) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    const results = [];

    for (const item of session.viewports) {
      const page = item.page;

      // Compute target position and dispatch scroll
      const updatedMetrics = await page.evaluate((scrollMode, targetProg, targetY) => {
        const root = document.scrollingElement || document.documentElement || document.body;
        const clientHeight = document.documentElement.clientHeight || window.innerHeight;
        const scrollHeight = Math.max(
          root ? root.scrollHeight : 0,
          document.documentElement.scrollHeight,
          document.body ? document.body.scrollHeight : 0
        );
        const maxScroll = Math.max(1, scrollHeight - clientHeight);

        let finalY = 0;
        if (scrollMode === "percentage") {
          finalY = Math.round(targetProg * maxScroll);
        } else {
          finalY = Math.min(maxScroll, Math.max(0, targetY));
        }

        window.scrollTo({
          top: finalY,
          left: 0,
          behavior: "instant"
        });

        const newCurrentY = window.scrollY || (root ? root.scrollTop : 0) || 0;
        return {
          title: document.title,
          scrollHeight,
          clientHeight,
          maxScroll,
          currentY: newCurrentY,
          progress: maxScroll > 0 ? newCurrentY / maxScroll : 0
        };
      }, mode, progress, scrollY);

      item.metrics = updatedMetrics;
      results.push({ index: item.index, metrics: updatedMetrics });
    }

    return results;
  }

  /**
   * Capture screenshot frame for a specific viewport
   */
  async captureFrame({ sessionId, viewportIndex, quality = 80 }) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    const vpItem = session.viewports.find(v => v.index === viewportIndex);
    if (!vpItem) throw new Error(`Viewport ${viewportIndex} not found in session ${sessionId}`);

    const buffer = await vpItem.page.screenshot({
      type: "jpeg",
      quality: Math.min(100, Math.max(10, quality))
    });

    return {
      index: viewportIndex,
      metrics: vpItem.metrics,
      imageBuffer: buffer,
      base64: buffer.toString("base64")
    };
  }

  /**
   * Terminate session and free context resources
   */
  async closeSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    try {
      if (session.viewports) {
        for (const vp of session.viewports) {
          if (vp.page && !vp.page.isClosed()) {
            await vp.page.close().catch(() => {});
          }
        }
      }
      if (session.context) {
        await session.context.close().catch(() => {});
      }
    } catch (e) {
      console.warn(`[BrowserManager] Error closing context for ${sessionId}: ${e.message}`);
    }

    this.sessions.delete(sessionId);
    return true;
  }
}

module.exports = new RemoteBrowserManager();
