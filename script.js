/* ==========================================================================
   Responsive Compare Workspace - Interactive Engine
   ========================================================================== */

const STORAGE_KEY = "responsive_compare_session_v2";

function getShineDemoHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SHINE STUDIO CONCIERGE | Automotive Perfection Redefined</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<script>
  window.addEventListener('scroll', function() {
    try {
      if (window.parent && window.parent.handleIframeScroll) {
        window.parent.handleIframeScroll(window);
      }
    } catch(e){}
  }, { passive: true });
</script>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #05080c;
    color: #e2e8f0;
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 4%;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .logo-box {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Outfit', sans-serif;
    font-weight: 900;
    letter-spacing: 2px;
    color: #fff;
    font-size: 1.1rem;
  }
  .logo-icon {
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, #00f2fe, #4facfe);
    border-radius: 6px;
    display: grid;
    place-items: center;
    color: #000;
  }
  nav { display: flex; gap: 20px; font-size: 0.85rem; color: #94a3b8; }
  nav a { color: inherit; text-decoration: none; font-weight: 500; }
  nav a:hover { color: #38bdf8; }
  .book-nav-btn {
    background: #0284c7;
    color: #fff;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
  }

  .hero {
    max-width: 1200px;
    margin: 0 auto;
    padding: 50px 4%;
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 40px;
    align-items: center;
  }
  @media (max-width: 850px) {
    .hero { grid-template-columns: 1fr; text-align: center; }
    nav { display: none; }
  }

  .tagline {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(14, 165, 233, 0.1);
    border: 1px solid rgba(14, 165, 233, 0.3);
    color: #38bdf8;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  h1 {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(2.2rem, 5vw, 3.6rem);
    font-weight: 900;
    line-height: 1.1;
    color: #ffffff;
    margin-bottom: 20px;
    letter-spacing: -0.5px;
  }

  p.desc {
    color: #94a3b8;
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 30px;
    max-width: 500px;
  }
  @media (max-width: 850px) { p.desc { margin-left: auto; margin-right: auto; } }

  .cta-group {
    display: flex;
    gap: 14px;
    align-items: center;
    margin-bottom: 36px;
  }
  @media (max-width: 850px) { .cta-group { justify-content: center; } }

  .btn-primary {
    background: linear-gradient(135deg, #0284c7, #2563eb);
    color: #fff;
    border: 0;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 0.85rem;
    letter-spacing: 1px;
    cursor: pointer;
    box-shadow: 0 10px 25px rgba(2, 132, 199, 0.3);
  }
  .btn-secondary {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.15);
    color: #fff;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
  }

  .stats-row {
    display: flex;
    gap: 30px;
    border-top: 1px solid rgba(255,255,255,0.08);
    padding-top: 20px;
  }
  @media (max-width: 850px) { .stats-row { justify-content: center; } }

  .stat-item strong {
    display: block;
    color: #38bdf8;
    font-size: 1.1rem;
    font-family: 'Outfit', sans-serif;
  }
  .stat-item span {
    font-size: 0.75rem;
    color: #64748b;
  }

  .car-card {
    background: #0b111a;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0,0,0,0.6);
  }
  .car-img-box {
    width: 100%;
    height: 240px;
    background: linear-gradient(135deg, #1e293b, #0f172a);
    display: grid;
    place-items: center;
    position: relative;
  }
  .car-img-box svg { width: 140px; opacity: 0.8; }
  .car-info { padding: 20px; }
  .car-info small { color: #38bdf8; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
  .car-info h3 { font-family: 'Outfit', sans-serif; font-size: 1.1rem; color: #fff; margin: 4px 0 8px; }
  .car-info p { color: #64748b; font-size: 0.8rem; }
</style>
</head>
<body>
  <header>
    <div class="logo-box">
      <div class="logo-icon">⚡</div>
      <span>SHINE STUDIO</span>
    </div>
    <nav>
      <a href="#">Home</a>
      <a href="#">Services</a>
      <a href="#">Gallery</a>
      <a href="#">Journal</a>
      <a href="#">Contact</a>
    </nav>
    <div class="book-nav-btn">Book Now</div>
  </header>

  <section class="hero">
    <div class="hero-content">
      <div class="tagline">✦ The Benchmark in Automotive Protection</div>
      <h1>AUTOMOTIVE PERFECTION, REDEFINED.</h1>
      <p class="desc">Master-grade paint correction, 9H ceramic nanocoatings, and bespoke interior restoration for discerning automobile connoisseurs.</p>
      <div class="cta-group">
        <button class="btn-primary">EXPLORE PACKAGES</button>
        <button class="btn-secondary">BOOK ESTIMATE</button>
      </div>
      <div class="stats-row">
        <div class="stat-item">
          <strong>5.0 ★ RATING</strong>
          <span>Verified Google Reviews</span>
        </div>
        <div class="stat-item">
          <strong>10-YR GUARANTEE</strong>
          <span>Certified Nanocoatings</span>
        </div>
      </div>
    </div>

    <div class="car-card">
      <div class="car-img-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="1.5">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.1 2 11.6 2 12v4c0 .6.4 1 1 1h2"/>
          <circle cx="7" cy="17" r="2"/>
          <circle cx="17" cy="17" r="2"/>
        </svg>
      </div>
      <div class="car-info">
        <small>Current Studio Highlight</small>
        <h3>Ferrari 488 Pista Ceramic Shield</h3>
        <p>Multi-stage correction + 9H Dual Coat Nanoceramic</p>
      </div>
    </div>
  </section>
</body>
</html>`;
}

const presets = [
  // Mobile Category (300px - 480px)
  { id: "p1", name: "Narrow Mobile", type: "mobile", width: 300, height: 800, os: "Mobile OS", ppi: 320, cat: "mobile" },
  { id: "p2", name: "Standard Mobile", type: "mobile", width: 360, height: 800, os: "Android", ppi: 420, cat: "mobile" },
  { id: "pm1", name: "iPhone SE / 8", type: "mobile", width: 375, height: 667, os: "iOS", ppi: 326, cat: "mobile" },
  { id: "pm2", name: "iPhone 13 / 14 / 15", type: "mobile", width: 390, height: 844, os: "iOS", ppi: 460, cat: "mobile" },
  { id: "p5", name: "iPhone 15 Pro", type: "mobile", width: 393, height: 852, os: "iOS", ppi: 460, cat: "mobile" },
  { id: "p6", name: "Google Pixel 8", type: "mobile", width: 412, height: 915, os: "Android", ppi: 428, cat: "mobile" },
  { id: "pm3", name: "iPhone 15 Pro Max", type: "mobile", width: 430, height: 932, os: "iOS", ppi: 460, cat: "mobile" },
  { id: "pm4", name: "Galaxy S24 Ultra", type: "mobile", width: 412, height: 915, os: "Android", ppi: 500, cat: "mobile" },
  { id: "pm5", name: "Foldable Cover Screen", type: "mobile", width: 374, height: 960, os: "Android", ppi: 400, cat: "mobile" },

  // Tablet Category (600px - 1024px)
  { id: "pt1", name: "Foldable Main Unfolded", type: "tablet", width: 673, height: 841, os: "Android", ppi: 374, cat: "tablet" },
  { id: "pt2", name: "iPad Mini (8.3\")", type: "tablet", width: 744, height: 1133, os: "iPadOS", ppi: 326, cat: "tablet" },
  { id: "pt_768", name: "Tablet Frame (768×800)", type: "tablet", width: 768, height: 800, os: "Tablet OS", ppi: 264, cat: "tablet" },
  { id: "p3", name: "Tablet Small", type: "tablet", width: 760, height: 800, os: "Tablet OS", ppi: 260, cat: "tablet" },
  { id: "pt3", name: "Galaxy Tab S9 (800)", type: "tablet", width: 800, height: 1280, os: "Android", ppi: 274, cat: "tablet" },
  { id: "p8", name: "iPad Air (10.9\")", type: "tablet", width: 820, height: 1180, os: "iPadOS", ppi: 264, cat: "tablet" },
  { id: "pt4", name: "Surface Pro 9", type: "tablet", width: 912, height: 1368, os: "Windows", ppi: 267, cat: "tablet" },
  { id: "p4", name: "Tablet View (1024)", type: "tablet", width: 1024, height: 800, os: "Tablet OS", ppi: 260, cat: "tablet" },
  { id: "p7", name: "iPad Pro 12.9\"", type: "tablet", width: 1024, height: 1366, os: "iPadOS", ppi: 263, cat: "tablet" },

  // Desktop & Laptop Category (1100px - 2000px)
  { id: "pd1", name: "Small Laptop / Netbook", type: "desktop", width: 1152, height: 720, os: "Windows", ppi: 120, cat: "desktop" },
  { id: "pd2", name: "MacBook Air 13\"", type: "desktop", width: 1280, height: 832, os: "macOS", ppi: 224, cat: "desktop" },
  { id: "p10", name: "Standard Laptop 13.3\"", type: "desktop", width: 1366, height: 768, os: "Windows", ppi: 110, cat: "desktop" },
  { id: "p9", name: "Desktop HD / MDPI", type: "desktop", width: 1440, height: 900, os: "macOS", ppi: 89, cat: "desktop" },
  { id: "pd3", name: "MacBook Pro 14\"", type: "desktop", width: 1512, height: 982, os: "macOS", ppi: 254, cat: "desktop" },
  { id: "pd4", name: "FHD Laptop / Scaling", type: "desktop", width: 1536, height: 864, os: "Windows", ppi: 125, cat: "desktop" },
  { id: "pd5", name: "FHD Monitor 1080p", type: "desktop", width: 1920, height: 1080, os: "Windows", ppi: 96, cat: "desktop" },
  { id: "pd6", name: "Ultra-Wide / 2K Display", type: "desktop", width: 2000, height: 1000, os: "Display OS", ppi: 110, cat: "desktop" }
];

const MULTI_TAB_STORAGE_KEY = "responsive_compare_multitabs_v5";

const appState = {
  activeTabId: null,
  tabs: []
};

function getActiveTab() {
  if (!appState.tabs || appState.tabs.length === 0) return null;
  return appState.tabs.find(t => t.id === appState.activeTabId) || appState.tabs[0];
}

const state = new Proxy({}, {
  get(target, prop) {
    const active = getActiveTab();
    if (!active) return undefined;
    return active[prop];
  },
  set(target, prop, value) {
    const active = getActiveTab();
    if (active) {
      active[prop] = value;
      return true;
    }
    return false;
  }
});

let isScrollingSyncLock = false;

const $ = id => document.getElementById(id);
const workspace = $("workspace");
const screenGrid = $("screenGrid");
const empty = $("empty");
const comparison = $("comparison");
const urlInput = $("urlInput");
const modal = $("deviceModal");
const toast = $("toast");
const devtoolsDrawer = $("devtoolsDrawer");

function generateId() {
  return "dev_" + Math.random().toString(36).substring(2, 9);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.add("hidden"), 3000);
}

function getTabTitleFromUrl(rawUrl) {
  if (!rawUrl || rawUrl === "shine" || rawUrl === "https://example.com") return "New Tab";
  try {
    let u = rawUrl.trim();
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    const parsed = new URL(u);
    return parsed.hostname.replace(/^www\./i, "") || "Comparison Tab";
  } catch (e) {
    return rawUrl.length > 18 ? rawUrl.substring(0, 16) + "..." : rawUrl || "New Tab";
  }
}

function syncUrlInputs(val) {
  const clean = (val === "shine" || val === "https://example.com") ? "" : (val || "");
  if (urlInput && urlInput.value !== clean) urlInput.value = clean;
  const emptyInp = $("emptyUrlInput");
  if (emptyInp && emptyInp.value !== clean) emptyInp.value = clean;
  const modalInp = $("modalUrlInput");
  if (modalInp && modalInp.value !== clean) modalInp.value = clean;
}

function getManualUrlInput() {
  const v1 = urlInput ? urlInput.value.trim() : "";
  const v2 = $("emptyUrlInput") ? $("emptyUrlInput").value.trim() : "";
  const v3 = $("modalUrlInput") ? $("modalUrlInput").value.trim() : "";
  const chosen = v1 || v2 || v3 || "";
  if (chosen === "shine" || chosen === "https://example.com") return "";
  return chosen;
}

function createNewTab(initialUrl = "", initialScreens = null) {
  const cleanInitialUrl = (initialUrl === "shine" || initialUrl === "https://example.com") ? "" : (initialUrl || "").trim();
  const tabId = "tab_" + Math.random().toString(36).substring(2, 9);
  const title = cleanInitialUrl ? getTabTitleFromUrl(cleanInitialUrl) : "New Tab";

  const newTab = {
    id: tabId,
    title: title,
    url: cleanInitialUrl,
    renderedUrl: "",
    activeScreenIndex: null,
    layout: "row",
    syncScroll: true,
    checkerboard: true,
    inComparison: !!(cleanInitialUrl && initialScreens && initialScreens.length > 0),
    selectedPresetIds: ["p2", "pt_768", "p4"],
    screens: initialScreens || []
  };

  if (newTab.inComparison && newTab.screens.length === 0 && cleanInitialUrl) {
    newTab.screens = newTab.selectedPresetIds.map(pId => {
      const p = presets.find(item => item.id === pId) || presets[1];
      return {
        id: generateId(),
        name: p.name,
        type: p.type,
        width: p.width,
        height: p.height,
        os: p.os,
        ppi: p.ppi,
        zoom: 1,
        rotated: false,
        errors: 0,
        warnings: 0,
        info: 0
      };
    });
  }

  appState.tabs.push(newTab);
  switchTab(tabId);
  saveSession();
}

function switchTab(tabId) {
  const target = appState.tabs.find(t => t.id === tabId);
  if (!target) return;
  appState.activeTabId = tabId;

  if (target.url === "shine" || target.url === "https://example.com") {
    target.url = "";
    target.inComparison = false;
  }

  syncUrlInputs(target.url);

  if (target.inComparison && target.url && target.screens.length >= 1) {
    empty.classList.add("hidden");
    comparison.classList.remove("hidden");
    renderScreens();
  } else {
    target.inComparison = false;
    empty.classList.remove("hidden");
    comparison.classList.add("hidden");
  }

  renderTabsBar();
  saveSession();
}

function closeTab(tabId, event) {
  if (event) event.stopPropagation();

  if (appState.tabs.length <= 1) {
    const current = appState.tabs[0];
    current.url = "";
    current.inComparison = false;
    current.screens = [];
    current.title = "New Tab";
    urlInput.value = "";
    empty.classList.remove("hidden");
    comparison.classList.add("hidden");
    renderTabsBar();
    saveSession();
    return;
  }

  const idx = appState.tabs.findIndex(t => t.id === tabId);
  appState.tabs = appState.tabs.filter(t => t.id !== tabId);

  if (appState.activeTabId === tabId) {
    const nextTab = appState.tabs[Math.max(0, idx - 1)];
    switchTab(nextTab.id);
  } else {
    renderTabsBar();
    saveSession();
  }
}

function renderTabsBar() {
  const container = $("tabsContainer");
  if (!container) return;

  container.innerHTML = appState.tabs.map(tab => {
    const isActive = tab.id === appState.activeTabId;
    const title = escapeHtml(tab.title || getTabTitleFromUrl(tab.url));
    return `
      <div class="tab-item ${isActive ? 'active' : ''}" data-tab-id="${tab.id}" title="${title}">
        <span class="tab-favicon">🌐</span>
        <span class="tab-title">${title}</span>
        <button type="button" class="tab-close-btn" data-tab-id="${tab.id}" title="Close Tab">✕</button>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".tab-item").forEach(item => {
    item.onclick = (e) => {
      if (e.target.classList.contains("tab-close-btn")) return;
      switchTab(item.dataset.tabId);
    };
  });

  container.querySelectorAll(".tab-close-btn").forEach(btn => {
    btn.onclick = (e) => closeTab(btn.dataset.tabId, e);
  });
}

function saveSession() {
  try {
    const session = {
      activeTabId: appState.activeTabId,
      tabs: appState.tabs
    };
    localStorage.setItem(MULTI_TAB_STORAGE_KEY, JSON.stringify(session));
  } catch (e) {}
}

function restoreSession() {
  try {
    const raw = localStorage.getItem(MULTI_TAB_STORAGE_KEY);
    if (raw) {
      const session = JSON.parse(raw);
      if (session && session.tabs && session.tabs.length >= 1) {
        appState.tabs = session.tabs.map(t => {
          const cleanUrl = (t.url === "shine" || t.url === "https://example.com") ? "" : (t.url || "");
          return {
            ...t,
            url: cleanUrl,
            inComparison: !!(cleanUrl && t.inComparison),
            screens: (t.screens || []).map(s => {
              if (s.width === 1024 && s.height === 800 && (s.type === "desktop" || s.name === "Desktop View")) {
                return { ...s, name: "Tablet View", type: "tablet", os: "Tablet OS" };
              }
              return s;
            })
          };
        });
        appState.activeTabId = session.activeTabId && appState.tabs.some(t => t.id === session.activeTabId)
          ? session.activeTabId
          : appState.tabs[0].id;

        switchTab(appState.activeTabId);
        return true;
      }
    }
  } catch (e) {}
  return false;
}

function getTargetSrc(rawUrl, index = 0) {
  if (!rawUrl || rawUrl === "shine" || rawUrl === "https://example.com") {
    return "about:blank";
  }
  let u = rawUrl.trim();
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  try {
    const parsed = new URL(u);
    const lastSeg = parsed.pathname.split("/").filter(Boolean).pop() || "";
    const pageSegment = lastSeg.includes(".") ? `/${encodeURIComponent(lastSeg)}` : "";
    const extraSearch = parsed.search ? `&${parsed.search.slice(1)}` : "";
    const hashPart = parsed.hash || "";
    return `${getApiBaseUrl()}/api/proxy${pageSegment}?url=${encodeURIComponent(u)}&index=${index}${extraSearch}${hashPart}`;
  } catch (e) {
    return `${getApiBaseUrl()}/api/proxy?url=${encodeURIComponent(u)}&index=${index}`;
  }
}

function resetToHomeLanding() {
  state.inComparison = false;
  state.url = "";
  const activeTab = getActiveTab();
  if (activeTab) activeTab.title = "New Tab";
  syncUrlInputs("");
  empty.classList.remove("hidden");
  comparison.classList.add("hidden");
  renderTabsBar();
  saveSession();
  showToast("Returned to Welcome Landing Screen");
}

const URL_HISTORY_STORAGE_KEY = "responsive_compare_url_history_v1";
let urlHistory = [];
let currentHistoryFilter = "all";
let currentHistorySearch = "";

function addUrlToHistory(rawUrl) {
  if (!rawUrl || rawUrl === "shine") return;
  let cleanUrl = rawUrl.trim();
  if (!/^https?:\/\//i.test(cleanUrl)) cleanUrl = "https://" + cleanUrl;

  const existingIndex = urlHistory.findIndex(item => item.url.toLowerCase() === cleanUrl.toLowerCase());
  const nowStr = new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (existingIndex !== -1) {
    urlHistory[existingIndex].timestamp = nowStr;
  } else {
    urlHistory.unshift({
      id: "hist_" + Math.random().toString(36).substring(2, 9),
      url: cleanUrl,
      title: getTabTitleFromUrl(cleanUrl),
      timestamp: nowStr,
      verified: false
    });
  }

  saveUrlHistory();
  if (typeof recordUserHistoryDirect === "function") {
    recordUserHistoryDirect(cleanUrl, "verified");
  }
}

function saveUrlHistory() {
  try {
    localStorage.setItem(URL_HISTORY_STORAGE_KEY, JSON.stringify(urlHistory));
  } catch (e) {}
}

function restoreUrlHistory() {
  try {
    const raw = localStorage.getItem(URL_HISTORY_STORAGE_KEY);
    if (raw) {
      urlHistory = JSON.parse(raw) || [];
    }
  } catch (e) {}
}

function openHistoryModal() {
  const modal = $("historyModal");
  if (modal) modal.classList.remove("hidden");
  renderHistoryList();
}

function closeHistoryModal() {
  const modal = $("historyModal");
  if (modal) modal.classList.add("hidden");
}

function renderHistoryList() {
  const container = $("historyListContainer");
  if (!container) return;

  const search = (currentHistorySearch || "").toLowerCase();
  let filtered = urlHistory.filter(item => {
    const matchSearch = item.url.toLowerCase().includes(search) || item.title.toLowerCase().includes(search);
    if (!matchSearch) return false;
    if (currentHistoryFilter === "verified") return item.verified;
    if (currentHistoryFilter === "pending") return !item.verified;
    return true;
  });

  const totalCount = urlHistory.length;
  const verifiedCount = urlHistory.filter(i => i.verified).length;
  const pendingCount = totalCount - verifiedCount;

  if ($("countAll")) $("countAll").textContent = totalCount;
  if ($("countVerified")) $("countVerified").textContent = verifiedCount;
  if ($("countPending")) $("countPending").textContent = pendingCount;
  if ($("historySummaryText")) $("historySummaryText").textContent = `${verifiedCount} of ${totalCount} URLs Verified`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-history-box">
        <div class="empty-hist-icon">📜</div>
        <strong>No URLs Found in History</strong>
        <p>Tested URLs will automatically be recorded here so you and your client can verify, check off, or re-test them anytime.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="history-card ${item.verified ? 'is-verified' : ''}" data-id="${item.id}">
      <div class="history-card-left">
        <label class="verify-checkbox-wrapper" title="Check box to mark URL layout as Verified or Pending">
          <input type="checkbox" class="verify-chk" data-id="${item.id}" ${item.verified ? 'checked' : ''}>
          <span class="custom-chk-box"></span>
        </label>
        <div class="history-card-info">
          <div class="history-url-line">
            <strong class="hist-title">${escapeHtml(item.title)}</strong>
            <span class="status-badge ${item.verified ? 'badge-verified' : 'badge-pending'}">
              ${item.verified ? '✓ Verified' : '⏳ Pending Review'}
            </span>
          </div>
          <span class="hist-link" title="${escapeHtml(item.url)}">${escapeHtml(item.url)}</span>
          <small class="hist-time">Tested on ${escapeHtml(item.timestamp)}</small>
        </div>
      </div>
      <div class="history-card-actions">
        <button type="button" class="recheck-btn" data-id="${item.id}" title="Re-check and view this URL in active comparison tab">
          <span>↗ Re-Check URL</span>
        </button>
        <button type="button" class="del-hist-btn" data-id="${item.id}" title="Remove from history">✕</button>
      </div>
    </div>
  `).join("");

  container.querySelectorAll(".verify-chk").forEach(chk => {
    chk.onchange = () => {
      const id = chk.dataset.id;
      const target = urlHistory.find(i => i.id === id);
      if (target) {
        target.verified = chk.checked;
        saveUrlHistory();
        renderHistoryList();
        showToast(target.verified ? `Marked "${target.title}" as Verified ✓` : `Marked "${target.title}" as Pending Review`);
      }
    };
  });

  container.querySelectorAll(".recheck-btn").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const target = urlHistory.find(i => i.id === id);
      if (target) {
        const activeTab = getActiveTab();
        if (activeTab) {
          activeTab.url = target.url;
          activeTab.inComparison = true;
          activeTab.title = target.title;
        }
        urlInput.value = target.url;
        startComparisonWithSelectedDevices();
        closeHistoryModal();
        showToast(`Loaded URL for re-check: ${target.url}`);
      }
    };
  });

  container.querySelectorAll(".del-hist-btn").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      urlHistory = urlHistory.filter(i => i.id !== id);
      saveUrlHistory();
      renderHistoryList();
    };
  });
}

function startComparisonWithSelectedDevices() {
  let target = getManualUrlInput();
  if (!target) {
    showToast("⚠️ Please enter a website URL manually to start comparing.");
    if (!modal.classList.contains("hidden") && $("modalUrlInput")) {
      $("modalUrlInput").focus();
    } else if (!empty.classList.contains("hidden") && $("emptyUrlInput")) {
      $("emptyUrlInput").focus();
    } else if (urlInput) {
      urlInput.focus();
    }
    return;
  }

  if (!/^https?:\/\//i.test(target)) {
    target = "https://" + target;
  }

  syncUrlInputs(target);
  state.url = target;
  const activeTab = getActiveTab();
  if (activeTab) {
    activeTab.title = getTabTitleFromUrl(target);
  }

  addUrlToHistory(target);

  if (!state.screens || state.screens.length === 0) {
    const presetList = (state.selectedPresetIds && state.selectedPresetIds.length >= 1)
      ? state.selectedPresetIds
      : ["p2", "pt_768", "p4"];
    state.screens = presetList.map(pId => {
      const p = presets.find(item => item.id === pId) || presets[1];
      return {
        id: generateId(),
        name: p.name,
        type: p.type,
        width: p.width,
        height: p.height,
        os: p.os,
        ppi: p.ppi,
        zoom: 1,
        rotated: false,
        errors: 0,
        warnings: 0,
        info: 0
      };
    });
  }

  state.inComparison = true;
  state.renderedUrl = getTargetSrc(target, 0);

  empty.classList.add("hidden");
  comparison.classList.remove("hidden");
  renderScreens();
  renderTabsBar();
  saveSession();
  closeDeviceModal();
}

function updateLayoutMode(mode) {
  state.layout = mode;
  workspace.classList.remove("layout-grid", "layout-row", "layout-stack");
  workspace.classList.add("layout-" + mode);
  
  const layoutBtn = $("viewLayoutModeBtn");
  if (layoutBtn) {
    layoutBtn.textContent = mode === "row" ? "▤ Row Scroll" : mode === "grid" ? "▦ Grid Wrap" : "☰ Stack";
  }
  
  [...screenGrid.children].forEach((card, i) => fitDeviceScreen(i, card));
  showToast(`Layout: ${mode === 'row' ? 'Horizontal Scroll' : mode === 'grid' ? 'Grid' : 'Stack'}`);
}

let currentSyncProgress = 0;
let targetSyncProgress = 0;
let currentSyncPixelY = 0;
let targetSyncPixelY = 0;
let activeSourceElement = null;
let isSyncAnimating = false;

function startAppSmoothScrollLoop() {
  if (isSyncAnimating) return;
  isSyncAnimating = true;

  function animate() {
    isScrollingSyncLock = true;
    const diff = targetSyncProgress - currentSyncProgress;

    if (Math.abs(diff) > 0.0005) {
      currentSyncProgress += diff * 0.35;

      if (targetSyncProgress === 0 && currentSyncProgress < 0.002) currentSyncProgress = 0;
      if (targetSyncProgress === 1 && currentSyncProgress > 0.998) currentSyncProgress = 1;

      const holders = document.querySelectorAll(".viewport-holder");
      holders.forEach(holder => {
        if (holder !== activeSourceElement && holder.querySelector("iframe") !== activeSourceElement) {
          const maxScroll = holder.scrollHeight - holder.clientHeight;
          let targetY = Math.round(currentSyncProgress * maxScroll);
          if (currentSyncProgress === 0) targetY = 0;
          if (currentSyncProgress === 1) targetY = maxScroll;

          if (maxScroll > 0) {
            holder.scrollTop = targetY;
          }

          const iframe = holder.querySelector("iframe");
          if (iframe && iframe !== activeSourceElement) {
            try {
              const win = iframe.contentWindow;
              const doc = iframe.contentDocument || win.document;
              if (win && doc) {
                const root = doc.scrollingElement || doc.documentElement || doc.body;
                const clientH = win.innerHeight || (doc.documentElement ? doc.documentElement.clientHeight : 0);
                const scrollH = Math.max(
                  root.scrollHeight,
                  doc.documentElement ? doc.documentElement.scrollHeight : 0,
                  doc.body ? doc.body.scrollHeight : 0
                );
                const maxDocScroll = Math.max(1, scrollH - clientH);

                let iframeTargetY = Math.round(currentSyncProgress * maxDocScroll);
                if (currentSyncProgress === 0) iframeTargetY = 0;
                if (currentSyncProgress === 1) iframeTargetY = maxDocScroll;

                win.scrollTo(0, iframeTargetY);
              }
            } catch (e) {}
          }
        }
      });
      requestAnimationFrame(animate);
    } else {
      currentSyncProgress = targetSyncProgress;
      isSyncAnimating = false;
      setTimeout(() => { isScrollingSyncLock = false; }, 40);
    }
  }

  requestAnimationFrame(animate);
}

function updateSyncScrollButtonState() {
  const metric = $("syncScrollMetricText");
  if (metric) { metric.textContent = "Always Enabled (100% Relative)"; metric.className = "text-green"; }
}

if ($("syncScrollToggleBtn")) {
  $("syncScrollToggleBtn").onclick = () => {
    state.syncScroll = !state.syncScroll;
    updateSyncScrollButtonState();
    showToast(state.syncScroll ? "Synchronized Scroll Enabled (ON)" : "Synchronized Scroll Disabled (OFF)");
  };
}

if ($("syncScrollModeSelect")) {
  $("syncScrollModeSelect").onchange = (e) => {
    showToast(`Sync Scroll Mode set to: ${e.target.value === "pixel" ? "Exact Pixel Offset (px)" : "Relative Percentage (%)"}`);
  };
}

window.handleIframeScroll = function(targetWin) {
  if (isScrollingSyncLock || !state.syncScroll) return;
  const iframes = document.querySelectorAll(".viewport-holder iframe");
  for (const iframe of iframes) {
    try {
      if (iframe.contentWindow === targetWin) {
        syncDeviceScroll(iframe);
        break;
      }
    } catch(e){}
  }
};

function syncDeviceScroll(sourceElement) {
  try {
    if (isScrollingSyncLock || state.syncScroll === false || !sourceElement) return;

    let progress = 0;
    let currentY = 0;
    let maxScroll = 1;

    const isHolder = sourceElement.classList && sourceElement.classList.contains("viewport-holder");

    if (isHolder) {
      maxScroll = Math.max(1, sourceElement.scrollHeight - sourceElement.clientHeight);
      currentY = sourceElement.scrollTop || 0;
      progress = currentY / maxScroll;
    } else if (sourceElement.contentWindow) {
      const win = sourceElement.contentWindow;
      const doc = sourceElement.contentDocument || win.document;
      if (win && doc) {
        const root = doc.scrollingElement || doc.documentElement || doc.body;
        const clientH = win.innerHeight || (doc.documentElement ? doc.documentElement.clientHeight : 0);
        const scrollH = Math.max(
          root.scrollHeight,
          doc.documentElement ? doc.documentElement.scrollHeight : 0,
          doc.body ? doc.body.scrollHeight : 0
        );
        maxScroll = Math.max(1, scrollH - clientH);
        currentY = win.scrollY || win.pageYOffset || (doc.documentElement && doc.documentElement.scrollTop) || (doc.body && doc.body.scrollTop) || 0;
        progress = currentY / maxScroll;
      }
    }

    if (currentY <= 2) {
      progress = 0;
    } else if (maxScroll - currentY <= 4) {
      progress = 1;
    } else {
      progress = Math.max(0, Math.min(1, progress));
    }

    activeSourceElement = sourceElement;
    targetSyncProgress = progress;
    targetSyncPixelY = currentY;

    startAppSmoothScrollLoop();
  } catch (e) {}
}



function shouldUseRemoteEngine(url) {
  return false;
}

// Listen for postMessage scroll, click, and navigation synchronization from live proxied iframes
window.addEventListener("message", (e) => {
  if (!e.data || typeof e.data !== "object") return;
  if (e.data.type === "USC_IFRAME_SCROLL") {
    if (state.syncScroll === false) return;
    const sourceIndex = e.data.index;
    const progress = typeof e.data.progress === "number" ? e.data.progress : 0;
    const scrollY = typeof e.data.scrollY === "number" ? e.data.scrollY : 0;
    const mode = ($("syncScrollModeSelect") && $("syncScrollModeSelect").value) || "percentage";

    const iframes = document.querySelectorAll(".viewport-holder iframe");
    iframes.forEach((ifr, idx) => {
      if (idx === sourceIndex) return;
      try {
        if (ifr.contentWindow) {
          ifr.contentWindow.postMessage({
            type: "USC_SYNC_TO",
            progress,
            scrollY,
            mode
          }, "*");
        }
      } catch (err) {}
    });
  } else if (e.data.type === "USC_IFRAME_CLICK") {
    if (state.syncScroll === false) return;
    const sourceIndex = e.data.index;
    const descriptor = e.data.descriptor;
    if (!descriptor) return;

    const iframes = document.querySelectorAll(".viewport-holder iframe");
    iframes.forEach((ifr, idx) => {
      if (idx === sourceIndex) return;
      try {
        if (ifr.contentWindow) {
          ifr.contentWindow.postMessage({
            type: "USC_REPLAY_CLICK",
            descriptor
          }, "*");
        }
      } catch (err) {}
    });
  } else if (e.data.type === "USC_IFRAME_NAVIGATE") {
    const newUrl = e.data.url;
    if (!newUrl) return;
    state.url = newUrl;
    syncUrlInputs(newUrl);
    const activeTab = getActiveTab();
    if (activeTab) {
      activeTab.title = getTabTitleFromUrl(newUrl);
    }
    renderTabsBar();
    saveSession();

    const iframes = document.querySelectorAll(".viewport-holder iframe");
    iframes.forEach((ifr, idx) => {
      try {
        ifr.src = getTargetSrc(newUrl, idx);
      } catch (err) {}
    });
  }
});

function renderScreens() {
  screenGrid.innerHTML = "";
  state.renderedUrl = getTargetSrc(state.url, 0);

  workspace.classList.remove("layout-grid", "layout-row", "layout-stack");
  workspace.classList.add("layout-" + state.layout);

  if ($("activeDeviceCountText")) {
    $("activeDeviceCountText").textContent = `${state.screens.length} Devices`;
  }

  state.screens.forEach((screen, index) => {
    const card = document.createElement("article");
    card.className = "screen-card";
    card.dataset.id = screen.id;
    card.dataset.type = screen.type;
    card.dataset.index = index;

    const effectiveW = screen.rotated ? screen.height : screen.width;
    const effectiveH = screen.rotated ? screen.width : screen.height;

    const iframeSrc = getTargetSrc(state.url, index);

    const viewportHtml = `
      <div class="viewport-holder" id="holder-${index}">
        <iframe src="${iframeSrc}" title="${escapeHtml(screen.name)} Viewport" allow="geolocation; microphone; camera; midi; encrypted-media; autoplay; clipboard-read; clipboard-write"></iframe>
      </div>
    `;

    card.innerHTML = `
      <div class="device-bar-header">
        <div class="device-title-selector" title="Click to change device model">
          <span>${escapeHtml(screen.name)}</span>
          <small class="dim-label">| ${screen.os} (${effectiveW}×${effectiveH}px) ▾</small>
        </div>
        <div class="device-header-actions">
          <button class="dev-action-btn move-left-btn" title="Move Position Left (Shift Up)" ${index === 0 ? 'disabled style="opacity:0.4;cursor:default;"' : ''}>◄</button>
          <button class="dev-action-btn move-right-btn" title="Move Position Right (Shift Down)" ${index === state.screens.length - 1 ? 'disabled style="opacity:0.4;cursor:default;"' : ''}>►</button>
          <button class="dev-action-btn capture-btn" title="Capture Screenshot">📷</button>
          <button class="dev-action-btn danger remove-btn" title="Remove Screen">✕</button>
        </div>
      </div>

      <div class="device-mockup-wrapper">
        <div class="device-mockup-frame">
          ${viewportHtml}
        </div>
        <!-- Drag-to-Resize Handle on Bottom Right -->
        <div class="device-resize-handle" title="Drag with mouse to adjust viewport width & height">⇲</div>
        ${screen.type === 'desktop' ? '<div class="monitor-neck"></div><div class="monitor-base"></div>' : ''}
      </div>

      <div class="device-bottom-status">
        <div class="status-badge-group">
          <span class="badge-item errors">🔴 ${screen.errors}</span>
          <span class="badge-item warnings">⚠️ ${screen.warnings}</span>
          <span class="badge-item info">ℹ️ ${screen.info}</span>
        </div>
        <div class="status-online-indicator">
          <span class="dot-online"></span>
          <span>Live Interactive</span>
        </div>
      </div>
    `;

    const holder = card.querySelector(".viewport-holder");
    const mockupFrame = card.querySelector(".device-mockup-frame");
    const iframe = card.querySelector("iframe");

    // Wheel listener on device bezel forwards scroll into the live iframe
    mockupFrame.addEventListener("wheel", (e) => {
      if (e.target === mockupFrame && iframe && iframe.contentWindow) {
        try {
          iframe.contentWindow.postMessage({ type: "USC_WHEEL_DELTA", deltaY: e.deltaY }, "*");
        } catch (err) {}
      }
    }, { passive: true });

    // Header action clicks
    card.querySelector(".device-title-selector").onclick = () => openSingleChangeModal(index);
    const moveLeft = card.querySelector(".move-left-btn");
    if (moveLeft) {
      moveLeft.onclick = (e) => {
        e.stopPropagation();
        if (index > 0) {
          const temp = state.screens[index];
          state.screens[index] = state.screens[index - 1];
          state.screens[index - 1] = temp;
          renderScreens();
          saveSession();
        }
      };
    }
    const moveRight = card.querySelector(".move-right-btn");
    if (moveRight) {
      moveRight.onclick = (e) => {
        e.stopPropagation();
        if (index < state.screens.length - 1) {
          const temp = state.screens[index];
          state.screens[index] = state.screens[index + 1];
          state.screens[index + 1] = temp;
          renderScreens();
          saveSession();
        }
      };
    }
    card.querySelector(".capture-btn").onclick = () => openScreenshotModalForDevice(index);
    card.querySelector(".remove-btn").onclick = () => removeDevice(index);

    // Mouse Drag-to-Resize Handler
    const resizeHandle = card.querySelector(".device-resize-handle");
    setupDragResize(card, resizeHandle, screen, index);

    screenGrid.appendChild(card);
    requestAnimationFrame(() => fitDeviceScreen(index, card));
  });

  if (shouldUseRemoteEngine(state.url)) {
    startRemoteSessionForScreens(state.url, state.screens);
  }

  updateSyncScrollButtonState();
}

// Mouse Drag-to-Resize Viewport Implementation
function setupDragResize(card, handle, screen, index) {
  let startX = 0, startY = 0;
  let startW = 0, startH = 0;
  let tooltip = null;

  function onMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();

    startX = e.clientX;
    startY = e.clientY;
    startW = screen.rotated ? screen.height : screen.width;
    startH = screen.rotated ? screen.width : screen.height;

    document.body.classList.add("is-resizing-active");
    card.classList.add("is-resizing");

    // Tooltip indicator
    tooltip = document.createElement("div");
    tooltip.className = "device-resize-tooltip";
    tooltip.textContent = `${startW} × ${startH}px`;
    card.querySelector(".device-mockup-wrapper").appendChild(tooltip);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  function onMouseMove(e) {
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    // New viewport dimensions bounded between 200px and 3840px
    const newW = Math.max(200, Math.min(3840, Math.round(startW + deltaX)));
    const newH = Math.max(200, Math.min(3840, Math.round(startH + deltaY)));

    if (screen.rotated) {
      screen.height = newW;
      screen.width = newH;
    } else {
      screen.width = newW;
      screen.height = newH;
    }

    // Live update header dim label
    const dimLabel = card.querySelector(".dim-label");
    if (dimLabel) dimLabel.textContent = `| ${screen.os} (${newW}×${newH}px) ▾`;

    if (tooltip) tooltip.textContent = `Resizing: ${newW} × ${newH}px`;

    const holder = card.querySelector(".viewport-holder");
    const iframe = card.querySelector("iframe");
    if (holder) {
      holder.style.width = newW + "px";
      holder.style.height = newH + "px";
    }
    if (iframe) {
      iframe.style.width = newW + "px";
      iframe.style.height = newH + "px";
    }

    fitDeviceScreen(index, card);
  }

  function onMouseUp() {
    document.body.classList.remove("is-resizing-active");
    card.classList.remove("is-resizing");

    if (tooltip && tooltip.parentNode) {
      tooltip.parentNode.removeChild(tooltip);
      tooltip = null;
    }

    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);

    const finalW = screen.rotated ? screen.height : screen.width;
    const finalH = screen.rotated ? screen.width : screen.height;
    showToast(`Resized ${screen.name} to ${finalW} × ${finalH}px`);
    saveSession();
  }

  handle.addEventListener("mousedown", onMouseDown);
}

function fitDeviceScreen(index, card) {
  const screen = state.screens[index];
  if (!screen) return;

  const holder = card.querySelector(".viewport-holder");
  const iframe = card.querySelector("iframe");

  const effectiveW = screen.rotated ? screen.height : screen.width;
  const effectiveH = screen.rotated ? screen.width : screen.height;

  holder.style.width = effectiveW + "px";
  holder.style.height = effectiveH + "px";

  iframe.style.width = effectiveW + "px";
  iframe.style.height = effectiveH + "px";
  iframe.style.transform = "none";
}

function rotateDevice(index) {
  const screen = state.screens[index];
  screen.rotated = !screen.rotated;
  showToast(`Rotated ${screen.name} to ${screen.rotated ? 'Landscape' : 'Portrait'}`);
  renderScreens();
  saveSession();
}

function removeDevice(index) {
  if (state.screens.length <= 1) {
    showToast("At least 1 device screen is required in comparison.");
    return;
  }
  const removedName = state.screens[index].name;
  state.screens.splice(index, 1);
  showToast(`Removed ${removedName}. ${state.screens.length} device(s) remaining.`);
  renderScreens();
  saveSession();
}

function openMultiSelectDeviceModal() {
  state.activeScreenIndex = null;
  $("modalTitleText").textContent = "Select Devices to Compare";
  $("modalSubText").textContent = "Choose minimum 2 devices to start side-by-side comparison";
  
  if (appState.tabs.length === 0) {
    createNewTab("", null);
  }

  syncUrlInputs(getManualUrlInput() || state.url || "");

  if (!state.selectedPresetIds || !Array.isArray(state.selectedPresetIds) || state.selectedPresetIds.length < 2) {
    state.selectedPresetIds = ["p2", "pt_768", "p4"];
  }

  renderMultiPresetOptions("all");
  updateSelectionFooterStatus();
  modal.classList.remove("hidden");
}

function openSingleChangeModal(index) {
  state.activeScreenIndex = index;
  const s = state.screens[index];
  $("modalTitleText").textContent = `Change Device: ${s.name}`;
  $("modalSubText").textContent = "Select a new preset to swap this viewport";

  renderSinglePresetOptions("all");
  modal.classList.remove("hidden");
}

let currentModalCategory = "all";

function renderMultiPresetOptions(category) {
  if (category) currentModalCategory = category;
  const container = $("devicePresets");
  const filtered = currentModalCategory === "all" ? presets : presets.filter(p => p.cat === currentModalCategory);
  const currentIds = (state && Array.isArray(state.selectedPresetIds)) ? state.selectedPresetIds : ["p2", "p4"];

  container.innerHTML = filtered.map(p => {
    const selectedIdx = currentIds.indexOf(p.id);
    const isSelected = selectedIdx !== -1;
    return `
      <button class="device-option ${isSelected ? 'selected' : ''}" data-id="${p.id}">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong>${escapeHtml(p.name)}</strong>
          <span class="chk-icon">${isSelected ? `<span class="pos-badge">#${selectedIdx + 1}</span> ✓` : '＋'}</span>
        </div>
        <small>${p.type.toUpperCase()} • ${p.width} × ${p.height}px</small>
      </button>
    `;
  }).join("");

  container.querySelectorAll(".device-option").forEach(btn => {
    btn.onclick = () => {
      const pId = btn.dataset.id;
      if (!Array.isArray(state.selectedPresetIds)) {
        state.selectedPresetIds = ["p2", "p4"];
      }
      if (state.selectedPresetIds.includes(pId)) {
        state.selectedPresetIds = state.selectedPresetIds.filter(id => id !== pId);
      } else {
        state.selectedPresetIds.push(pId);
      }
      renderMultiPresetOptions(currentModalCategory);
      updateSelectionFooterStatus();
    };
  });

  renderSelectedOrderList();
}

function renderSelectedOrderList() {
  const orderList = $("selectedOrderList");
  if (!orderList) return;

  const currentIds = (state && Array.isArray(state.selectedPresetIds)) ? state.selectedPresetIds : [];
  if (currentIds.length === 0) {
    orderList.innerHTML = `<div class="empty-order-msg">No devices selected yet. Click any devices above to select & align positions.</div>`;
    return;
  }

  orderList.innerHTML = currentIds.map((id, idx) => {
    const p = presets.find(item => item.id === id);
    const name = p ? p.name : "Custom Device";
    const dim = p ? `${p.width}×${p.height}px` : "";
    return `
      <div class="order-chip" data-id="${id}" data-index="${idx}">
        <span class="chip-num">#${idx + 1}</span>
        <span class="chip-name">${escapeHtml(name)}</span>
        <small class="chip-dim">${dim}</small>
        <div class="chip-actions">
          <button type="button" class="chip-btn shift-left-btn" title="Move Position Left" ${idx === 0 ? 'disabled' : ''}>◄</button>
          <button type="button" class="chip-btn shift-right-btn" title="Move Position Right" ${idx === currentIds.length - 1 ? 'disabled' : ''}>►</button>
          <button type="button" class="chip-btn chip-remove-btn" title="Remove device position">✕</button>
        </div>
      </div>
    `;
  }).join("");

  orderList.querySelectorAll(".order-chip").forEach(chip => {
    const idx = parseInt(chip.dataset.index, 10);
    const id = chip.dataset.id;

    const leftBtn = chip.querySelector(".shift-left-btn");
    const rightBtn = chip.querySelector(".shift-right-btn");
    const removeBtn = chip.querySelector(".chip-remove-btn");

    if (leftBtn) {
      leftBtn.onclick = (e) => {
        e.stopPropagation();
        if (idx > 0) {
          const temp = state.selectedPresetIds[idx];
          state.selectedPresetIds[idx] = state.selectedPresetIds[idx - 1];
          state.selectedPresetIds[idx - 1] = temp;
          renderMultiPresetOptions(currentModalCategory);
          updateSelectionFooterStatus();
        }
      };
    }

    if (rightBtn) {
      rightBtn.onclick = (e) => {
        e.stopPropagation();
        if (idx < state.selectedPresetIds.length - 1) {
          const temp = state.selectedPresetIds[idx];
          state.selectedPresetIds[idx] = state.selectedPresetIds[idx + 1];
          state.selectedPresetIds[idx + 1] = temp;
          renderMultiPresetOptions(currentModalCategory);
          updateSelectionFooterStatus();
        }
      };
    }

    if (removeBtn) {
      removeBtn.onclick = (e) => {
        e.stopPropagation();
        state.selectedPresetIds = state.selectedPresetIds.filter(item => item !== id);
        renderMultiPresetOptions(currentModalCategory);
        updateSelectionFooterStatus();
      };
    }
  });
}

function renderSinglePresetOptions(category) {
  const container = $("devicePresets");
  const filtered = category === "all" ? presets : presets.filter(p => p.cat === category);

  container.innerHTML = filtered.map(p => `
    <button class="device-option" data-id="${p.id}">
      <strong>${escapeHtml(p.name)}</strong>
      <small>${p.type.toUpperCase()} • ${p.width} × ${p.height}px</small>
    </button>
  `).join("");

  container.querySelectorAll(".device-option").forEach(btn => {
    btn.onclick = () => {
      const p = presets.find(item => item.id === btn.dataset.id);
      if (p && state.activeScreenIndex !== null && state.screens[state.activeScreenIndex]) {
        const s = state.screens[state.activeScreenIndex];
        s.name = p.name;
        s.type = p.type;
        s.width = p.width;
        s.height = p.height;
        s.os = p.os;
        s.ppi = p.ppi;
        s.rotated = false;
        renderScreens();
        saveSession();
        closeDeviceModal();
      }
    };
  });
}

function updateSelectionFooterStatus() {
  const count = state.selectedPresetIds.length;
  const badge = $("selectedDevicesBadge");
  const btn = $("startCompareSelectedBtn");

  if (count < 2) {
    badge.textContent = `${count} Device(s) Selected (Min 2 Required)`;
    badge.style.color = "#ef4444";
    btn.textContent = `Select Min 2 Devices (${count} Selected)`;
    btn.disabled = true;
    btn.classList.add("disabled");
  } else {
    badge.textContent = `${count} Devices Selected`;
    badge.style.color = "#22c55e";
    btn.textContent = `Start Comparing (${count} Selected)`;
    btn.disabled = false;
    btn.classList.remove("disabled");
  }
}

function closeDeviceModal() {
  modal.classList.add("hidden");
  state.activeScreenIndex = null;
}

function generateScreenshotCanvas(screen) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const w = screen.rotated ? screen.height : screen.width;
  const h = screen.rotated ? screen.width : screen.height;

  canvas.width = Math.min(w + 40, 1200);
  canvas.height = Math.min(h + 80, 1600);

  ctx.fillStyle = "#16131c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#272036";
  ctx.fillRect(10, 10, canvas.width - 20, 36);

  ctx.fillStyle = "#c49bf5";
  ctx.font = "bold 13px Inter, sans-serif";
  ctx.fillText(`📱 ${screen.name} (${w} × ${h}px)`, 24, 33);

  ctx.fillStyle = "#05080c";
  ctx.fillRect(20, 56, canvas.width - 40, canvas.height - 76);

  ctx.fillStyle = "#6331a6";
  ctx.fillRect(35, 75, canvas.width - 70, 45);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px Outfit, sans-serif";
  ctx.fillText("SHINE STUDIO CONCIERGE", 50, 103);

  return canvas;
}

function openScreenshotModalForDevice(index) {
  state.activeScreenIndex = index;
  const screen = state.screens[index] || state.screens[0];
  const w = screen.rotated ? screen.height : screen.width;
  const h = screen.rotated ? screen.width : screen.height;

  $("screenshotMeta").textContent = `${screen.name} • ${w} × ${h}px`;
  const canvas = generateScreenshotCanvas(screen);
  const previewBox = $("screenshotCanvasPreview");
  previewBox.innerHTML = "";
  
  canvas.style.maxWidth = "100%";
  canvas.style.maxHeight = "280px";
  canvas.style.borderRadius = "8px";
  previewBox.appendChild(canvas);

  $("screenshotModal").classList.remove("hidden");
}

async function executeCopyScreenshot() {
  const screen = state.screens[state.activeScreenIndex] || state.screens[0];
  const canvas = generateScreenshotCanvas(screen);

  canvas.toBlob(async (blob) => {
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        showToast(`📋 Copied ${screen.name} screenshot to Clipboard!`);
      } else {
        await navigator.clipboard.writeText(canvas.toDataURL("image/png"));
        showToast("📋 Copied Screenshot Data URL to Clipboard!");
      }
    } catch (err) {
      showToast("📋 Screenshot ready!");
    }
  }, "image/png");
}

function executeDownloadScreenshot() {
  const screen = state.screens[state.activeScreenIndex] || state.screens[0];
  const canvas = generateScreenshotCanvas(screen);
  const w = screen.rotated ? screen.height : screen.width;
  const h = screen.rotated ? screen.width : screen.height;

  const dataUrl = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `screenshot-${screen.name.toLowerCase().replace(/\s+/g, '-')}-${w}x${h}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  showToast(`⬇️ Downloaded ${screen.name} PNG Screenshot!`);
}

function toggleDevToolsDrawer() {
  devtoolsDrawer.classList.toggle("collapsed");
}

urlInput.addEventListener("input", () => {
  if ($("quickDemoSelect")) {
    $("quickDemoSelect").value = "";
  }
});

if ($("quickDemoSelect")) {
  $("quickDemoSelect").onchange = () => {
    const val = $("quickDemoSelect").value;
    if (val === "shine") {
      urlInput.value = "vworks.github.io/shine-studio";
    } else if (val) {
      urlInput.value = val;
    }
    if (state.inComparison) {
      startComparisonWithSelectedDevices();
    }
  };
}

// Dedicated Sync Scroll Enable / Disable Button Handler
if ($("syncScrollToggleBtn")) {
  $("syncScrollToggleBtn").onclick = () => {
    state.syncScroll = !state.syncScroll;
    updateSyncScrollButtonState();
    showToast(`Synchronized Scrolling ${state.syncScroll ? 'Enabled (ON)' : 'Disabled (OFF)'}`);
  };
}

if ($("toggleCheckerboard")) {
  $("toggleCheckerboard").onclick = (e) => {
    e.preventDefault();
    state.checkerboard = !state.checkerboard;
    workspace.classList.toggle("no-grid", !state.checkerboard);
    showToast(`Background Grid ${state.checkerboard ? 'Enabled' : 'Disabled'}`);
  };
}

if ($("menuSortWidthAsc")) {
  $("menuSortWidthAsc").onclick = (e) => {
    e.preventDefault();
    state.screens.sort((a, b) => a.width - b.width);
    renderScreens();
    saveSession();
    showToast("Aligned viewports: Smallest to largest width");
  };
}

if ($("menuSortReverse")) {
  $("menuSortReverse").onclick = (e) => {
    e.preventDefault();
    state.screens.reverse();
    renderScreens();
    saveSession();
    showToast("Aligned viewports: Reversed sequence");
  };
}

if ($("sortAscWidthBtn")) {
  $("sortAscWidthBtn").onclick = () => {
    state.selectedPresetIds.sort((a, b) => {
      const pA = presets.find(item => item.id === a);
      const pB = presets.find(item => item.id === b);
      const wA = pA ? pA.width : 0;
      const wB = pB ? pB.width : 0;
      return wA - wB;
    });
    renderMultiPresetOptions(currentModalCategory);
    updateSelectionFooterStatus();
    showToast("Aligned positions: Smallest to largest width");
  };
}

if ($("reverseOrderBtn")) {
  $("reverseOrderBtn").onclick = () => {
    state.selectedPresetIds.reverse();
    renderMultiPresetOptions(currentModalCategory);
    updateSelectionFooterStatus();
    showToast("Aligned positions: Reversed sequence");
  };
}

if ($("menuCopyScreenshot")) {
  $("menuCopyScreenshot").onclick = (e) => {
    e.preventDefault();
    openScreenshotModalForDevice(0);
    executeCopyScreenshot();
  };
}

if ($("menuDownloadScreenshot")) {
  $("menuDownloadScreenshot").onclick = (e) => {
    e.preventDefault();
    openScreenshotModalForDevice(0);
    executeDownloadScreenshot();
  };
}

if ($("toggleDevTools")) {
  $("toggleDevTools").onclick = (e) => {
    e.preventDefault();
    toggleDevToolsDrawer();
  };
}

// Event Listeners
if ($("homeBackBtn")) $("homeBackBtn").onclick = resetToHomeLanding;
if ($("appLogoBtn")) $("appLogoBtn").onclick = resetToHomeLanding;

if (urlInput) {
  urlInput.addEventListener("input", () => syncUrlInputs(urlInput.value));
  urlInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      syncUrlInputs(urlInput.value);
      if (!state.screens || state.screens.length < 2) {
        openMultiSelectDeviceModal();
      } else {
        startComparisonWithSelectedDevices();
      }
    }
  });
}

if ($("emptyUrlInput")) {
  $("emptyUrlInput").addEventListener("input", e => syncUrlInputs(e.target.value));
  $("emptyUrlInput").addEventListener("keydown", e => {
    if (e.key === "Enter") {
      syncUrlInputs(e.target.value);
      openMultiSelectDeviceModal();
    }
  });
}

if ($("modalUrlInput")) {
  $("modalUrlInput").addEventListener("input", e => syncUrlInputs(e.target.value));
  $("modalUrlInput").addEventListener("keydown", e => {
    if (e.key === "Enter") {
      syncUrlInputs(e.target.value);
      if (state.selectedPresetIds && state.selectedPresetIds.length >= 2) {
        state.screens = [];
        startComparisonWithSelectedDevices();
      }
    }
  });
}

if ($("compareBtn")) {
  $("compareBtn").onclick = () => {
    if (!getManualUrlInput()) {
      showToast("⚠️ Please enter a website URL manually first.");
      if (urlInput) urlInput.focus();
      return;
    }
    if (!state.screens || state.screens.length < 2) {
      openMultiSelectDeviceModal();
    } else {
      startComparisonWithSelectedDevices();
    }
  };
}

if ($("customCompareBtn")) {
  $("customCompareBtn").onclick = () => {
    openMultiSelectDeviceModal();
  };
}

if ($("quickExampleBtn")) {
  $("quickExampleBtn").onclick = () => {
    state.selectedPresetIds = ["p2", "p4"];
    state.screens = [];
    startComparisonWithSelectedDevices();
  };
}

if ($("quick3DeviceBtn")) {
  $("quick3DeviceBtn").onclick = () => {
    state.selectedPresetIds = ["p2", "pt_768", "p4"]; // Standard Mobile (360×800), Tablet Frame (768×800), Tablet View (1024×800)
    state.screens = [];
    if (!getManualUrlInput()) {
      openMultiSelectDeviceModal();
      showToast("Selected 3 devices! Paste your website URL above to start comparing.");
      if ($("modalUrlInput")) $("modalUrlInput").focus();
      return;
    }
    startComparisonWithSelectedDevices();
    showToast("Started 3-Device Comparison!");
  };
}

if ($("startCompareSelectedBtn")) {
  $("startCompareSelectedBtn").onclick = () => {
    if (state.selectedPresetIds.length >= 2) {
      state.screens = [];
      startComparisonWithSelectedDevices();
    }
  };
}

if ($("addScreenBtn")) {
  $("addScreenBtn").onclick = () => {
    openMultiSelectDeviceModal();
  };
}

$("closeModal").onclick = closeDeviceModal;
modal.addEventListener("click", e => { if (e.target === modal) closeDeviceModal(); });

$("closeScreenshotModal").onclick = () => $("screenshotModal").classList.add("hidden");
$("copyScreenshotBtn").onclick = () => { executeCopyScreenshot(); $("screenshotModal").classList.add("hidden"); };
$("downloadScreenshotBtn").onclick = () => { executeDownloadScreenshot(); $("screenshotModal").classList.add("hidden"); };

if ($("captureCopyBtn")) $("captureCopyBtn").onclick = () => { openScreenshotModalForDevice(0); executeCopyScreenshot(); };
if ($("captureDownloadBtn")) $("captureDownloadBtn").onclick = () => { openScreenshotModalForDevice(0); executeDownloadScreenshot(); };

$("themeToggleBtn").onclick = () => {
  document.body.classList.toggle("dark-workspace");
  const isDark = document.body.classList.contains("dark-workspace");
  showToast(`Switched to ${isDark ? 'Dark Workspace' : 'Light Workspace'} Mode`);
};

$("reloadAll").onclick = () => {
  if (!state.inComparison) {
    openMultiSelectDeviceModal();
  } else {
    showToast("Reloaded viewports.");
    renderScreens();
  }
};

if ($("viewLayoutRow")) $("viewLayoutRow").onclick = () => updateLayoutMode("row");
if ($("viewLayoutGrid")) $("viewLayoutGrid").onclick = () => updateLayoutMode("grid");
if ($("viewLayoutStack")) $("viewLayoutStack").onclick = () => updateLayoutMode("stack");
if ($("layoutToggleBtn")) {
  $("layoutToggleBtn").onclick = () => {
    const nextMode = state.layout === "row" ? "grid" : state.layout === "grid" ? "stack" : "row";
    updateLayoutMode(nextMode);
  };
}

$("closeDevTools").onclick = () => devtoolsDrawer.classList.add("collapsed");
$("clearConsoleBtn").onclick = () => {
  $("tabConsole").innerHTML = `<div class="console-line info">[Console] Log cleared.</div>`;
};

document.querySelectorAll(".device-tab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".device-tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    if (state.activeScreenIndex === null) {
      renderMultiPresetOptions(tab.dataset.cat);
    } else {
      renderSinglePresetOptions(tab.dataset.cat);
    }
  };
});

$("applyCustom").onclick = () => {
  const name = $("modalLabel").value.trim() || "Custom Device";
  const w = Number($("modalW").value);
  const h = Number($("modalH").value);
  const type = $("modalType").value;

  if (!w || !h || w < 200 || w > 3840 || h < 200 || h > 3840) {
    showToast("Please enter valid width and height (200px - 3840px)");
    return;
  }

  const customObj = {
    id: generateId(),
    name,
    type,
    width: w,
    height: h,
    os: "Custom",
    ppi: 300,
    zoom: 1,
    rotated: false,
    errors: 0,
    warnings: 0,
    info: 0
  };

  state.screens.push(customObj);
  state.inComparison = true;
  empty.classList.add("hidden");
  comparison.classList.remove("hidden");
  renderScreens();
  saveSession();
  closeDeviceModal();
  showToast(`Added custom device: ${name} (${w}×${h}px)`);
};

if ($("addTabBtn")) {
  $("addTabBtn").onclick = () => {
    createNewTab("", null);
    showToast("Opened new browser comparison tab");
  };
}

// History Modal Listeners
if ($("historyBtn")) $("historyBtn").onclick = openHistoryModal;
if ($("menuOpenHistory")) {
  $("menuOpenHistory").onclick = (e) => {
    e.preventDefault();
    openHistoryModal();
  };
}
if ($("closeHistoryModal")) $("closeHistoryModal").onclick = closeHistoryModal;
if ($("closeHistoryFooterBtn")) $("closeHistoryFooterBtn").onclick = closeHistoryModal;

const histModal = $("historyModal");
if (histModal) {
  histModal.addEventListener("click", e => {
    if (e.target === histModal) closeHistoryModal();
  });
}

if ($("historySearchInput")) {
  $("historySearchInput").oninput = (e) => {
    currentHistorySearch = e.target.value;
    renderHistoryList();
  };
}

document.querySelectorAll(".history-tab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".history-tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentHistoryFilter = tab.dataset.filter;
    renderHistoryList();
  };
});

if ($("clearHistoryBtn")) {
  $("clearHistoryBtn").onclick = () => {
    if (urlHistory.length === 0) return;
    if (confirm("Are you sure you want to clear all URL history?")) {
      urlHistory = [];
      saveUrlHistory();
      renderHistoryList();
      showToast("Cleared URL history");
    }
  };
}

// About / Ownership Certificate Modal Logic (Confidential Authorship Locked until Purchased)
function updateAboutModalConfidentiality() {
  const lockedBox = $("confidentialAuthorLocked");
  const unlockedBox = $("confidentialAuthorUnlocked");
  const isPaid = currentAuthUser && currentAuthUser.subscriptionStatus === "paid";

  if (isPaid) {
    if (lockedBox) lockedBox.classList.add("hidden");
    if (unlockedBox) unlockedBox.classList.remove("hidden");
  } else {
    if (lockedBox) lockedBox.classList.remove("hidden");
    if (unlockedBox) unlockedBox.classList.add("hidden");
  }
}

function openAboutModal() {
  updateAboutModalConfidentiality();
  const modal = $("aboutModal");
  if (modal) modal.classList.remove("hidden");
}
function closeAboutModal() {
  const modal = $("aboutModal");
  if (modal) modal.classList.add("hidden");
}

if ($("headerLicenseBtn")) $("headerLicenseBtn").onclick = openAboutModal;
if ($("menuOpenAbout")) {
  $("menuOpenAbout").onclick = (e) => {
    e.preventDefault();
    openAboutModal();
  };
}
if ($("closeAboutModal")) $("closeAboutModal").onclick = closeAboutModal;
if ($("closeAboutFooterBtn")) $("closeAboutFooterBtn").onclick = closeAboutModal;

const abtModal = $("aboutModal");
if (abtModal) {
  abtModal.addEventListener("click", e => {
    if (e.target === abtModal) closeAboutModal();
  });
}

// Initial Page Load Check
window.onload = () => {
  restoreUrlHistory();
  const restored = restoreSession();
  if (!restored) {
    createNewTab("", null);
  }
  initRemoteBrowserEngineClient();
  initAuthManager();
};

/* ==========================================================================
   Remote Browser Rendering Client (Browserless & Local Chromium Gateway)
   ========================================================================== */
let remoteEngineActive = false;
let currentRemoteSessionId = null;
let remoteWs = null;

function getApiBaseUrl() {
  // If explicitly accessed directly from the backend server port (3001)
  if (window.location.protocol.startsWith("http") && window.location.port === "3001") {
    return window.location.origin;
  }
  // If hosted on a remote production or staging domain
  if (window.location.protocol.startsWith("http") && 
      window.location.hostname !== "localhost" && 
      window.location.hostname !== "127.0.0.1" &&
      window.location.port !== "5500" && 
      window.location.port !== "8080" && 
      window.location.port !== "3000" && 
      window.location.port !== "5173") {
    return window.location.origin;
  }
  // Default fallback for Live Server (5500), file:// protocol, Electron, and local dev
  return "http://localhost:3001";
}

async function safeFetchJson(endpoint, options = {}) {
  const url = endpoint.startsWith("http") ? endpoint : `${getApiBaseUrl()}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  let res;
  try {
    res = await fetch(url, options);
  } catch (netErr) {
    throw new Error(
      `Cannot connect to backend server at ${getApiBaseUrl()}. Please make sure the backend is running ('npm run server').`
    );
  }

  const text = await res.text();
  let data = null;
  if (text && text.trim().length > 0) {
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      throw new Error(
        res.ok
          ? "Received invalid JSON from server."
          : `Server error (HTTP ${res.status}). Ensure backend server is running on port 3001.`
      );
    }
  } else {
    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status} with empty response. Ensure backend server is running on port 3001.`);
    }
    data = {};
  }

  if (!res.ok) {
    const errorMsg = data && (data.error || data.message)
      ? (data.error || data.message)
      : `Request failed with HTTP status ${res.status}`;
    const err = new Error(errorMsg);
    err.status = res.status;
    err.code = data && data.code;
    err.data = data;
    throw err;
  }

  return data;
}

async function checkRemoteEngineHealth() {
  const badge = $("engineStatusBadge");
  const statusText = $("remoteEngineStatusText");
  const modeText = $("remoteEngineModeText");

  try {
    const data = await safeFetchJson("/api/health", { cache: "no-store" });
    const bInfo = (data && data.browser) || { mode: (data && data.browserMode) || "local" };
    const currentMode = (bInfo.mode || "local").toUpperCase();
    const isCloud = currentMode === "CLOUD";

    if (badge) {
      badge.textContent = `⚡ Remote Engine: ${currentMode} ${isCloud ? "☁️ (Browserless)" : "💻 (Local Chrome)"}`;
      badge.parentElement.classList.remove("off-state");
      badge.parentElement.classList.add("highlight");
    }
    if (statusText) statusText.textContent = `Online & Connected (Port 3001) - Mode: ${currentMode}`;
    if (modeText) {
      modeText.textContent = isCloud
        ? "Mode: Browserless.io Cloud Cluster (Offloaded)"
        : "Mode: Local Chromium / Edge (Stealth Mode)";
    }
    return true;
  } catch (err) {
    if (badge) {
      badge.textContent = "⚡ Remote Engine: Offline (Run: npm run server)";
      badge.parentElement.classList.add("off-state");
      badge.parentElement.classList.remove("highlight");
    }
    if (statusText) statusText.textContent = "Offline (Start backend with: npm run server)";
    return false;
  }
}

function openEngineSettingsModal() {
  const modal = $("engineSettingsModal");
  if (!modal) return;
  modal.classList.remove("hidden");

  safeFetchJson("/api/health").then(data => {
    const b = (data && data.browser) || {};
    const mode = b.mode || "local";
    const radioLocal = $("radioModeLocal");
    const radioCloud = $("radioModeCloud");
    const optLocal = $("optCardLocal");
    const optCloud = $("optCardCloud");
    const tokenBox = $("cloudTokenConfigBox");
    const infoText = $("engineActiveModeInfo");

    if (mode === "cloud") {
      if (radioCloud) radioCloud.checked = true;
      if (optCloud) optCloud.classList.add("active");
      if (optLocal) optLocal.classList.remove("active");
      if (tokenBox) tokenBox.classList.remove("hidden");
      if (infoText) infoText.textContent = "Active Engine: Browserless.io Cloud Cluster (Offloaded)";
    } else {
      if (radioLocal) radioLocal.checked = true;
      if (optLocal) optLocal.classList.add("active");
      if (optCloud) optCloud.classList.remove("active");
      if (tokenBox) tokenBox.classList.add("hidden");
      if (infoText) infoText.textContent = `Active Engine: Local Headless Chrome (${b.localChromeFound ? "Detected" : "Searching"})`;
    }
  }).catch(() => {});
}

function closeEngineSettingsModal() {
  const modal = $("engineSettingsModal");
  if (modal) modal.classList.add("hidden");
}

function initRemoteBrowserEngineClient() {
  checkRemoteEngineHealth();

  if ($("engineToggleBtn")) {
    $("engineToggleBtn").onclick = () => {
      openEngineSettingsModal();
    };
  }

  if ($("menuRemoteBrowserStatus")) {
    $("menuRemoteBrowserStatus").onclick = (e) => {
      e.preventDefault();
      openEngineSettingsModal();
    };
  }

  const radioLocal = $("radioModeLocal");
  const radioCloud = $("radioModeCloud");
  const optLocal = $("optCardLocal");
  const optCloud = $("optCardCloud");
  const tokenBox = $("cloudTokenConfigBox");

  if (radioLocal && radioCloud) {
    radioLocal.onchange = () => {
      if (optLocal) optLocal.classList.add("active");
      if (optCloud) optCloud.classList.remove("active");
      if (tokenBox) tokenBox.classList.add("hidden");
    };
    radioCloud.onchange = () => {
      if (optCloud) optCloud.classList.add("active");
      if (optLocal) optLocal.classList.remove("active");
      if (tokenBox) tokenBox.classList.remove("hidden");
    };
  }

  if ($("closeEngineSettingsBtn")) $("closeEngineSettingsBtn").onclick = closeEngineSettingsModal;
  if ($("cancelEngineSettingsBtn")) $("cancelEngineSettingsBtn").onclick = closeEngineSettingsModal;

  if ($("applyEngineSettingsBtn")) {
    $("applyEngineSettingsBtn").onclick = async () => {
      const mode = radioCloud && radioCloud.checked ? "cloud" : "local";
      const apiKey = $("browserlessApiKeyInput") ? $("browserlessApiKeyInput").value.trim() : "";
      const token = getAuthToken();

      try {
        await safeFetchJson("/api/settings/browser-mode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : ""
          },
          body: JSON.stringify({ mode, apiKey: apiKey || undefined })
        });

        closeEngineSettingsModal();
        await checkRemoteEngineHealth();
        showToast(`✓ Engine switched to: ${mode === "cloud" ? "Browserless.io Cloud Cluster" : "Local Headless Chrome"}`);
      } catch (err) {
        showToast("Error configuring engine: " + err.message);
      }
    };
  }
}

let isRemoteSyncing = false;
let remoteSessionLoading = false;

async function startRemoteSessionForScreens(url, screens) {
  if (remoteSessionLoading) return;
  remoteSessionLoading = true;

  const token = getAuthToken();
  if (!token) {
    openAuthModal("register");
    remoteSessionLoading = false;
    return;
  }

  const viewports = screens.map((s, i) => ({
    name: s.name,
    width: s.rotated ? s.height : s.width,
    height: s.rotated ? s.width : s.height,
    isMobile: s.type === "mobile"
  }));

  try {
    const data = await safeFetchJson("/api/session/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ targetUrl: url, viewports })
    });

    currentRemoteSessionId = data.sessionId;
    const sessionText = $("remoteSessionIdText");
    if (sessionText) sessionText.textContent = data.sessionId;

    // Fast Instant Render: Show pre-captured initial frames immediately (0 extra round trips!)
    if (data.viewports && Array.isArray(data.viewports)) {
      data.viewports.forEach(v => {
        const img = $(`remote-img-${v.index}`);
        const overlay = $(`overlay-${v.index}`);
        const spacer = $(`spacer-${v.index}`);
        if (v.initialFrameBase64 && img) {
          img.src = "data:image/jpeg;base64," + v.initialFrameBase64;
          if (overlay) overlay.classList.add("hidden");
          if (spacer && v.metrics && v.metrics.scrollHeight) {
            spacer.style.height = v.metrics.scrollHeight + "px";
          }
          updateRemoteDepthUI(v.index, v.metrics ? v.metrics.progress : 0, v.metrics ? v.metrics.currentY : 0);
        } else {
          loadRemoteFrame(data.sessionId, v.index);
        }
      });
    } else {
      for (let i = 0; i < screens.length; i++) {
        loadRemoteFrame(data.sessionId, i);
      }
    }
  } catch (err) {
    console.warn("[RemoteEngine] Failed to start remote session:", err);
    if (err.code === "SUBSCRIPTION_EXPIRED" || err.status === 403) {
      openUpgradeModal();
      showToast("⚠️ Your 3-day free trial has expired. Upgrade to Pro for ₹399/mo to continue.");
    } else {
      showToast("Subscription note: " + err.message);
    }
  } finally {
    remoteSessionLoading = false;
  }
}

const frameInFlightMap = {};
const framePendingMap = {};

async function loadRemoteFrame(sessionId, index) {
  if (frameInFlightMap[index]) {
    framePendingMap[index] = true;
    return;
  }
  frameInFlightMap[index] = true;

  const img = $(`remote-img-${index}`);
  const overlay = $(`overlay-${index}`);
  const spacer = $(`spacer-${index}`);
  if (!img) {
    frameInFlightMap[index] = false;
    return;
  }

  try {
    const data = await safeFetchJson(`/api/session/${sessionId}/frame/${index}?format=json&q=65`, {
      headers: { "Authorization": `Bearer ${getAuthToken()}` }
    });
    if (data.success && data.base64) {
      img.src = "data:image/jpeg;base64," + data.base64;
      if (overlay) overlay.classList.add("hidden");
      if (spacer && data.metrics && data.metrics.scrollHeight) {
        spacer.style.height = data.metrics.scrollHeight + "px";
      }
      updateRemoteDepthUI(index, data.metrics ? data.metrics.progress : 0, data.metrics ? data.metrics.currentY : 0);
    }
  } catch (err) {
    console.warn(`[RemoteEngine] Error fetching frame ${index}:`, err);
  } finally {
    frameInFlightMap[index] = false;
    if (framePendingMap[index]) {
      framePendingMap[index] = false;
      loadRemoteFrame(sessionId, index);
    }
  }
}

function updateRemoteDepthUI(index, progress, scrollY) {
  const tag = $(`depth-tag-${index}`);
  const progBar = $(`prog-${index}`);
  const pct = Math.round(progress * 100);

  if (tag) {
    tag.textContent = `Depth: ${pct}% | ${Math.round(scrollY)}px`;
  }
  if (progBar) {
    progBar.style.width = pct + "%";
  }
}

let remoteScrollTimer = null;
function syncRemoteDeviceScroll(sourceIndex, progress, scrollY) {
  if (!currentRemoteSessionId || isRemoteSyncing) return;

  updateRemoteDepthUI(sourceIndex, progress, scrollY);

  // Synchronize scroll positions of other holders smoothly
  isRemoteSyncing = true;
  state.screens.forEach((_, idx) => {
    if (idx === sourceIndex) return;
    const otherHolder = $(`holder-${idx}`);
    if (otherHolder) {
      const otherMax = otherHolder.scrollHeight - otherHolder.clientHeight;
      if (otherMax > 0) {
        otherHolder.scrollTop = Math.round(progress * otherMax);
      }
      updateRemoteDepthUI(idx, progress, otherHolder.scrollTop);
    }
  });
  isRemoteSyncing = false;

  // Debounced server dispatch for remote Chromium pages
  clearTimeout(remoteScrollTimer);
  remoteScrollTimer = setTimeout(async () => {
    try {
      const data = await safeFetchJson("/api/session/scroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          sessionId: currentRemoteSessionId,
          sourceIndex,
          progress,
          scrollY,
          mode: "percentage"
        })
      });
      if (data && data.viewports) {
        data.viewports.forEach(v => {
          if (v.index !== sourceIndex) {
            loadRemoteFrame(currentRemoteSessionId, v.index);
          }
        });
      }
    } catch (e) {
      if (e.code === "SUBSCRIPTION_EXPIRED" || e.status === 403) {
        openUpgradeModal();
      }
    }
  }, 40);
}

/* ==========================================================================
   User Authentication & Strict Tenant Isolation Client
   ========================================================================== */
let currentAuthUser = null;
const AUTH_TOKEN_KEY = "usc_auth_token";
const CACHED_USER_KEY = "usc_cached_user";
const EXPLICIT_LOGOUT_KEY = "usc_explicit_logout";

function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function setAuthToken(token, userObj = null) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.removeItem(EXPLICIT_LOGOUT_KEY);
    if (userObj) {
      try { localStorage.setItem(CACHED_USER_KEY, JSON.stringify(userObj)); } catch (e) {}
    }
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(CACHED_USER_KEY);
  }
}

function getCachedUser() {
  try {
    const raw = localStorage.getItem(CACHED_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setAuthAlert(msg, type = "error") {
  const box = $("authAlertBox");
  if (!box) return;
  if (!msg) {
    box.classList.add("hidden");
    box.textContent = "";
    return;
  }
  box.className = `auth-alert ${type}`;
  box.textContent = msg;
}

async function verifyAuthSession() {
  const token = getAuthToken();

  if (!token) {
    showPublicLanding();
    return false;
  }

  try {
    const data = await safeFetchJson("/api/auth/me", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (data.success && data.user) {
      currentAuthUser = data.user;
      setAuthToken(token, data.user);
      showAppWorkspace(data.user);
      loadUserPrivateHistory();
      return true;
    } else {
      setAuthToken(null);
      showPublicLanding();
      return false;
    }
  } catch (err) {
    // Only clear token if server explicitly rejected it with 401; never clear on temporary network/server restart
    if (err && err.status === 401) {
      setAuthToken(null);
      showPublicLanding();
      return false;
    }
    const cached = getCachedUser();
    if (cached) {
      currentAuthUser = cached;
      showAppWorkspace(cached);
      loadUserPrivateHistory();
      return true;
    }
    showPublicLanding();
    return false;
  }
}

function showPublicLanding() {
  const landing = $("publicLandingView");
  const workspace = $("appWorkspaceView");
  if (landing) landing.classList.remove("hidden");
  if (workspace) workspace.classList.add("hidden");
  document.body.classList.add("dark-saas");
}

function showAppWorkspace(user) {
  const landing = $("publicLandingView");
  const workspace = $("appWorkspaceView");
  if (landing) landing.classList.add("hidden");
  if (workspace) workspace.classList.remove("hidden");
  document.body.classList.remove("dark-saas");
  updateWorkspaceUserUI(user);
}

function updateAuthHeaderText(isSignIn) {
  const title = $("authHeaderTitle");
  const sub = $("authHeaderSub");
  if (isSignIn) {
    if (title) title.textContent = "Welcome Back";
    if (sub) sub.textContent = "Sign in to access your synchronized testing workspace";
  } else {
    if (title) title.textContent = "Start 3-Day Free Trial (₹0)";
    if (sub) sub.textContent = "Exact 72 hours full access • Mandatory signup for private data isolation";
  }
}

function setupPasswordToggle(inputId, buttonId) {
  const input = $(inputId);
  const btn = $(buttonId);
  if (!input || !btn) return;

  const showIcon = btn.querySelector(".eye-show");
  const hideIcon = btn.querySelector(".eye-hide");

  btn.onclick = (e) => {
    e.preventDefault();
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    btn.setAttribute("title", isPassword ? "Hide password" : "Show password");
    btn.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");

    if (showIcon && hideIcon) {
      if (isPassword) {
        showIcon.classList.add("hidden");
        hideIcon.classList.remove("hidden");
      } else {
        showIcon.classList.remove("hidden");
        hideIcon.classList.add("hidden");
      }
    }
    input.focus();
  };
}

function validatePasswordMatch() {
  const regPwd = $("regPassword");
  const regConfirm = $("regConfirmPassword");
  const hint = $("regPasswordMatchHint");
  if (!regPwd || !regConfirm || !hint) return;

  const pwdVal = regPwd.value;
  const confirmVal = regConfirm.value;

  if (!confirmVal) {
    hint.className = "pwd-match-hint hidden";
    hint.textContent = "";
    regConfirm.classList.remove("input-matched", "input-mismatched");
    return;
  }

  if (pwdVal === confirmVal) {
    hint.className = "pwd-match-hint matched";
    hint.textContent = "✓ Passwords match";
    regConfirm.classList.add("input-matched");
    regConfirm.classList.remove("input-mismatched");
  } else {
    hint.className = "pwd-match-hint mismatched";
    hint.textContent = "✕ Passwords do not match";
    regConfirm.classList.add("input-mismatched");
    regConfirm.classList.remove("input-matched");
  }
}

function resetPasswordVisibility() {
  const pairs = [
    { inputId: "loginPassword", btnId: "toggleLoginPasswordBtn" },
    { inputId: "regPassword", btnId: "toggleRegPasswordBtn" },
    { inputId: "regConfirmPassword", btnId: "toggleRegConfirmPasswordBtn" },
    { inputId: "browserlessApiKeyInput", btnId: "toggleBrowserlessKeyBtn" }
  ];

  pairs.forEach(({ inputId, btnId }) => {
    const input = $(inputId);
    const btn = $(btnId);
    if (input) input.type = "password";
    if (btn) {
      btn.setAttribute("title", "Show password");
      btn.setAttribute("aria-label", "Toggle password visibility");
      const showIcon = btn.querySelector(".eye-show");
      const hideIcon = btn.querySelector(".eye-hide");
      if (showIcon) showIcon.classList.remove("hidden");
      if (hideIcon) hideIcon.classList.add("hidden");
    }
  });

  const regConfirm = $("regConfirmPassword");
  const hint = $("regPasswordMatchHint");
  if (regConfirm) regConfirm.classList.remove("input-matched", "input-mismatched");
  if (hint) {
    hint.className = "pwd-match-hint hidden";
    hint.textContent = "";
  }
}

function openAuthModal(defaultTab = "register") {
  const modal = $("authModal");
  if (!modal) return;
  modal.classList.remove("hidden");
  resetPasswordVisibility();

  const tabSignIn = $("tabBtnSignIn");
  const tabRegister = $("tabBtnRegister");
  const formSignIn = $("signInForm");
  const formRegister = $("registerForm");

  if (defaultTab === "signin") {
    if (tabSignIn) tabSignIn.classList.add("active");
    if (tabRegister) tabRegister.classList.remove("active");
    if (formSignIn) formSignIn.classList.remove("hidden");
    if (formRegister) formRegister.classList.add("hidden");
    updateAuthHeaderText(true);
  } else {
    if (tabRegister) tabRegister.classList.add("active");
    if (tabSignIn) tabSignIn.classList.remove("active");
    if (formRegister) formRegister.classList.remove("hidden");
    if (formSignIn) formSignIn.classList.add("hidden");
    updateAuthHeaderText(false);
  }
  setAuthAlert(null);
}

function closeAuthModal() {
  const modal = $("authModal");
  if (modal) modal.classList.add("hidden");
  resetPasswordVisibility();
}

function setUpgradeAlert(msg, type = "error") {
  const box = $("upgradeAlertBox");
  if (!box) return;
  if (!msg) {
    box.classList.add("hidden");
    box.textContent = "";
    return;
  }
  box.className = `auth-alert ${type}`;
  box.textContent = msg;
}

function openUpgradeModal() {
  const modal = $("upgradeModal");
  if (!modal) return;
  setUpgradeAlert(null);

  const subText = $("upgradeModalSub");
  const badgeText = $("upgradeBadgeText");
  if (currentAuthUser && currentAuthUser.subscriptionStatus === "paid") {
    if (badgeText) badgeText.textContent = "✓ Pro Plan Active";
    if (subText) subText.textContent = "Your Administrator Pro Plan is active.";
  } else {
    if (badgeText) badgeText.textContent = `⏳ Free Trial Active (${(currentAuthUser && currentAuthUser.remainingTrialHours) || 72}h left)`;
    if (subText) subText.textContent = "Online payment gateway integration coming soon";
  }

  modal.classList.remove("hidden");
}

function closeUpgradeModal() {
  const modal = $("upgradeModal");
  if (modal) modal.classList.add("hidden");
  setUpgradeAlert(null);
}

function updateWorkspaceUserUI(user) {
  const nameSpan = $("userDisplayName");
  const pill = $("subStatusPill");
  const text = $("subRemainingText");

  if (nameSpan && user) {
    nameSpan.textContent = user.fullName || user.username;
  }

  if (pill && text && user) {
    if (user.subscriptionStatus === "paid") {
      pill.className = "sub-status-pill paid";
      text.textContent = "✓ Pro Plan Active";
      const upBtn = $("subUpgradeBtn");
      if (upBtn) upBtn.style.display = "none";
    } else if (user.subscriptionStatus === "temp_pro") {
      pill.className = "sub-status-pill temp-pro";
      text.textContent = `⚡ Temp Pro: ${user.remainingTrialHours || 24}h left`;
      const upBtn = $("subUpgradeBtn");
      if (upBtn) {
        upBtn.textContent = "Admin Pro Upgrade";
        upBtn.style.display = "inline-block";
      }
    } else if (user.subscriptionStatus === "trial") {
      pill.className = "sub-status-pill trial";
      text.textContent = `⏳ Free Trial: ${user.remainingTrialHours || 72}h left`;
      const upBtn = $("subUpgradeBtn");
      if (upBtn) {
        upBtn.textContent = "Upgrade (₹399/mo)";
        upBtn.style.display = "inline-block";
      }
    } else {
      pill.className = "sub-status-pill expired";
      text.textContent = "⚠️ Trial Expired";
      openUpgradeModal();
    }
  }
}

async function loadUserPrivateHistory() {
  const token = getAuthToken();
  if (!token) return;

  try {
    const data = await safeFetchJson("/api/user/history", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (data.success && data.history) {
      urlHistory = data.history.map(item => ({
        url: item.url,
        verified: item.status === "verified",
        date: new Date(item.tested_at).toLocaleString()
      }));
      renderHistoryList();
    }
  } catch (e) {
    console.warn("Failed to load user private history:", e.message);
  }
}

async function recordUserHistoryDirect(url, status = "verified") {
  const token = getAuthToken();
  if (!token) return;

  try {
    await safeFetchJson("/api/user/history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ url, status })
    });
  } catch (e) {}
}

function initAuthManager() {
  verifyAuthSession();

  // Public Landing Buttons
  if ($("navSignInBtn")) $("navSignInBtn").onclick = () => openAuthModal("signin");
  if ($("navStartTrialBtn")) $("navStartTrialBtn").onclick = () => openAuthModal("register");
  if ($("heroStartTrialBtn")) $("heroStartTrialBtn").onclick = () => openAuthModal("register");
  if ($("pricingStartTrialBtn")) $("pricingStartTrialBtn").onclick = () => openAuthModal("register");
  if ($("footerStartTrialBtn")) $("footerStartTrialBtn").onclick = () => openAuthModal("register");

  if ($("pricingSubscribeBtn")) {
    $("pricingSubscribeBtn").onclick = () => {
      if (currentAuthUser) {
        openUpgradeModal();
      } else {
        openAuthModal("register");
      }
    };
  }

  if ($("subUpgradeBtn")) $("subUpgradeBtn").onclick = openUpgradeModal;
  if ($("closeUpgradeModalBtn")) $("closeUpgradeModalBtn").onclick = closeUpgradeModal;
  if ($("cancelUpgradeModalBtn")) $("cancelUpgradeModalBtn").onclick = closeUpgradeModal;
  if ($("closeAuthModalBtn")) $("closeAuthModalBtn").onclick = closeAuthModal;

  const upgModal = $("upgradeModal");
  if (upgModal) {
    upgModal.addEventListener("click", (e) => {
      if (e.target === upgModal) closeUpgradeModal();
    });
  }

  if ($("copyUpiBtn")) {
    $("copyUpiBtn").onclick = async () => {
      try {
        await navigator.clipboard.writeText("smartfusion@upi");
      } catch (e) {}
      const btn = $("copyUpiBtn");
      btn.textContent = "✓ Copied";
      showToast("Copied UPI ID: smartfusion@upi");
      setTimeout(() => { btn.textContent = "📋 Copy UPI"; }, 2000);
    };
  }

  if ($("copySupportEmailBtn")) {
    $("copySupportEmailBtn").onclick = async () => {
      try {
        await navigator.clipboard.writeText("support@smartfusion.com");
      } catch (e) {}
      const btn = $("copySupportEmailBtn");
      btn.textContent = "✓ Copied";
      showToast("Copied Support Email: support@smartfusion.com");
      setTimeout(() => { btn.textContent = "📋 Copy Email"; }, 2000);
    };
  }

  if ($("pasteLicenseKeyBtn")) {
    $("pasteLicenseKeyBtn").onclick = async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text && $("upgradeLicenseKeyInput")) {
          $("upgradeLicenseKeyInput").value = text.trim();
          $("upgradeLicenseKeyInput").focus();
          showToast("Pasted license key from clipboard");
        }
      } catch (e) {
        if ($("upgradeLicenseKeyInput")) $("upgradeLicenseKeyInput").focus();
      }
    };
  }

  // Workspace Back / Portal navigation
  if ($("homeBackBtn")) $("homeBackBtn").onclick = showPublicLanding;
  if ($("appLogoBtn")) $("appLogoBtn").onclick = showPublicLanding;

  // Setup Password Visibility Toggles
  setupPasswordToggle("loginPassword", "toggleLoginPasswordBtn");
  setupPasswordToggle("regPassword", "toggleRegPasswordBtn");
  setupPasswordToggle("regConfirmPassword", "toggleRegConfirmPasswordBtn");
  setupPasswordToggle("browserlessApiKeyInput", "toggleBrowserlessKeyBtn");
  setupPasswordToggle("upgradeAdminPassInput", "toggleUpgradeAdminPassBtn");

  // Register PWA Service Worker & Capture Cross-Platform Install Prompt (Windows, macOS, Linux, Android, iOS)
  let deferredPwaPrompt = null;
  if ("serviceWorker" in navigator && window.location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPwaPrompt = e;
  });

  function setInstallAppAlert(msg, type = "info") {
    const box = $("installAppAlertBox");
    if (!box) return;
    if (!msg) {
      box.classList.add("hidden");
      box.textContent = "";
      return;
    }
    box.className = `auth-alert ${type}`;
    box.textContent = msg;
  }

  async function openInstallAppModal() {
    const modal = $("installAppModal");
    if (!modal) return;
    setInstallAppAlert(null);
    modal.classList.remove("hidden");

    const pubCode = $("sharePublicUrlText");
    const lanCode = $("shareLanUrlText");
    const pubBtn = $("copyPublicUrlBtn");
    try {
      const info = await safeFetchJson("/api/network-info", { cache: "no-store" });
      if (lanCode && info.lanUrl) lanCode.textContent = info.lanUrl;
      if (pubCode) {
        const isRemoteOrigin = window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1" && !window.location.hostname.startsWith("192.168.");
        if (info.publicUrl) {
          pubCode.textContent = info.publicUrl;
          if (pubBtn) pubBtn.textContent = "Copy Link";
        } else if (isRemoteOrigin) {
          pubCode.textContent = window.location.origin;
          if (pubBtn) pubBtn.textContent = "Copy Link";
        } else {
          pubCode.textContent = "node start-tunnel.js (Run in terminal for Remote HTTPS Link)";
          if (pubBtn) pubBtn.textContent = "Copy Cmd";
        }
      }
    } catch (e) {
      if (pubCode) pubCode.textContent = window.location.origin;
      if (lanCode) lanCode.textContent = "http://localhost:3001";
    }
  }

  function closeInstallAppModal() {
    const modal = $("installAppModal");
    if (modal) modal.classList.add("hidden");
    setInstallAppAlert(null);
  }

  ["navDownloadExeBtn", "heroDownloadExeBtn", "workspaceShareAppBtn"].forEach(id => {
    const el = $(id);
    if (el) {
      el.onclick = (e) => {
        e.preventDefault();
        openInstallAppModal();
      };
    }
  });

  if ($("closeInstallAppModalBtn")) $("closeInstallAppModalBtn").onclick = closeInstallAppModal;
  if ($("installAppModal")) {
    $("installAppModal").onclick = (e) => {
      if (e.target.id === "installAppModal") closeInstallAppModal();
    };
  }

  if ($("copyPublicUrlBtn")) {
    $("copyPublicUrlBtn").onclick = async () => {
      const rawText = $("sharePublicUrlText") ? $("sharePublicUrlText").textContent.trim() : window.location.origin;
      const copyVal = rawText.startsWith("node start-tunnel.js") ? "node start-tunnel.js" : rawText;
      try { await navigator.clipboard.writeText(copyVal); } catch (e) {}
      const btn = $("copyPublicUrlBtn");
      const prev = btn.textContent;
      btn.textContent = "✓ Copied";
      if (copyVal === "node start-tunnel.js") {
        setInstallAppAlert("🌐 For colleagues in Remote Locations: Run 'node start-tunnel.js' in your project terminal to generate an instant public https:// link pointing to your server, or deploy to Render.com / Railway.app using render.yaml!", "success");
      } else {
        showToast(`Copied Remote Shared Link: ${copyVal}`);
      }
      setTimeout(() => { btn.textContent = prev === "✓ Copied" ? "Copy Link" : prev; }, 2000);
    };
  }

  if ($("copyLanUrlBtn")) {
    $("copyLanUrlBtn").onclick = async () => {
      const urlText = $("shareLanUrlText") ? $("shareLanUrlText").textContent.trim() : "http://localhost:3001";
      try { await navigator.clipboard.writeText(urlText); } catch (e) {}
      const btn = $("copyLanUrlBtn");
      btn.textContent = "✓ Copied";
      showToast(`Copied Wi-Fi / LAN Link: ${urlText}`);
      setTimeout(() => { btn.textContent = "Copy Link"; }, 2000);
    };
  }

  if ($("installPwaAppBtn")) {
    $("installPwaAppBtn").onclick = async () => {
      if (deferredPwaPrompt) {
        deferredPwaPrompt.prompt();
        const choice = await deferredPwaPrompt.userChoice;
        deferredPwaPrompt = null;
        if (choice && choice.outcome === "accepted") {
          closeInstallAppModal();
          showToast("🎉 Standalone App installed on your device!");
        }
      } else {
        setInstallAppAlert(
          "📲 To install on this device right now: In Chrome/Edge/Brave (Windows, Mac, Linux, Android), click the 'Install App' icon in the right side of your browser address bar (or Menu ⋮ → 'Install Universal Scroll Compare Pro'). On iPhone/iPad/Mac Safari, tap Share → 'Add to Home Screen / Add to Dock'.",
          "success"
        );
      }
    };
  }

  if ($("downloadWindowsExeModalBtn")) {
    $("downloadWindowsExeModalBtn").onclick = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/api/download/exe`, { method: "HEAD" });
        if (res.ok) {
          window.location.href = `${getApiBaseUrl()}/api/download/exe`;
        } else {
          setInstallAppAlert("🪟 To generate the portable Windows .exe file locally, run 'npm run portable' in your project terminal (outputs dist-portable-exe/ResponsiveCompare-Portable.exe), or click 'Install Standalone App (All OS)' to install immediately from your browser!", "error");
        }
      } catch (e) {
        window.location.href = `${getApiBaseUrl()}/api/download/exe`;
      }
    };
  }

  // Setup Real-time Confirm Password Validation
  const regPwdInput = $("regPassword");
  const regConfirmInput = $("regConfirmPassword");
  if (regPwdInput && regConfirmInput) {
    regPwdInput.addEventListener("input", validatePasswordMatch);
    regConfirmInput.addEventListener("input", validatePasswordMatch);
  }

  // Tab Switching
  const tabSignIn = $("tabBtnSignIn");
  const tabRegister = $("tabBtnRegister");
  const formSignIn = $("signInForm");
  const formRegister = $("registerForm");

  if (tabSignIn && tabRegister) {
    tabSignIn.onclick = () => {
      tabSignIn.classList.add("active");
      tabRegister.classList.remove("active");
      if (formSignIn) formSignIn.classList.remove("hidden");
      if (formRegister) formRegister.classList.add("hidden");
      updateAuthHeaderText(true);
      setAuthAlert(null);
      resetPasswordVisibility();
    };

    tabRegister.onclick = () => {
      tabRegister.classList.add("active");
      tabSignIn.classList.remove("active");
      if (formRegister) formRegister.classList.remove("hidden");
      if (formSignIn) formSignIn.classList.add("hidden");
      updateAuthHeaderText(false);
      setAuthAlert(null);
      resetPasswordVisibility();
    };
  }

  // Handle Sign In Submit
  if (formSignIn) {
    formSignIn.onsubmit = async (e) => {
      e.preventDefault();
      setAuthAlert(null);
      const identifier = $("loginIdentifier").value.trim();
      const password = $("loginPassword").value;

      try {
        const data = await safeFetchJson("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usernameOrEmail: identifier, password })
        });

        setAuthToken(data.token, data.user);
        currentAuthUser = data.user;
        closeAuthModal();
        showAppWorkspace(data.user);
        loadUserPrivateHistory();
        showToast(`Welcome back, ${data.user.fullName || data.user.username}!`);
      } catch (err) {
        setAuthAlert(err.message, "error");
      }
    };
  }

  // Handle Registration Submit (Activates Mandatory 3-Day Free Trial)
  if (formRegister) {
    formRegister.onsubmit = async (e) => {
      e.preventDefault();
      setAuthAlert(null);
      const fullName = $("regFullName").value.trim();
      const username = $("regUsername").value.trim();
      const email = $("regEmail").value.trim();
      const password = $("regPassword").value;
      const confirmPassword = $("regConfirmPassword") ? $("regConfirmPassword").value : "";

      if (password.length < 6) {
        setAuthAlert("Password must be at least 6 characters long.", "error");
        $("regPassword").focus();
        return;
      }

      if (password !== confirmPassword) {
        setAuthAlert("Passwords do not match. Please verify and re-enter your password.", "error");
        if ($("regConfirmPassword")) {
          $("regConfirmPassword").focus();
          validatePasswordMatch();
        }
        return;
      }

      try {
        const data = await safeFetchJson("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, username, email, password, confirmPassword })
        });

        setAuthToken(data.token, data.user);
        currentAuthUser = data.user;
        closeAuthModal();
        showAppWorkspace(data.user);
        loadUserPrivateHistory();
        showToast(`Welcome, ${data.user.fullName}! Your 3-day (72-hour) free trial is now active.`);
      } catch (err) {
        setAuthAlert(err.message, "error");
      }
    };
  }

  // Handle Upgrade Button Click -> Show "Coming Soon" Notice for Normal/Personal Users
  if ($("confirmSubscribeBtn")) {
    $("confirmSubscribeBtn").onclick = async () => {
      const token = getAuthToken();
      if (!token) {
        closeUpgradeModal();
        openAuthModal("register");
        return;
      }

      setUpgradeAlert(
        "🚀 Coming Soon! Online payment gateway integration (UPI / Cards / NetBanking) is not linked yet. Your account remains active on the Free Trial plan.",
        "success"
      );
      showToast("🚀 Coming Soon — No payment gateways linked yet!");
    };
  }

  // Handle Logout
  if ($("logoutBtn")) {
    $("logoutBtn").onclick = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          await safeFetchJson("/api/auth/logout", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
          });
        } catch (e) {}
      }
      setAuthToken(null);
      localStorage.setItem(EXPLICIT_LOGOUT_KEY, "true");
      currentAuthUser = null;
      showPublicLanding();
      showToast("Signed out. You have returned to the public portal.");
    };
  }
}



