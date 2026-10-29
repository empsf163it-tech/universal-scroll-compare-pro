const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const http = require('http');

let embeddedServer = null;
const PORT = process.env.PORT || 3001;

function ensureBackendServer() {
  return new Promise((resolve) => {
    // Ensure writable database directory when running from packaged .exe (app.asar)
    if (app.isPackaged && !process.env.USC_DATA_DIR) {
      process.env.USC_DATA_DIR = path.join(app.getPath('userData'), 'data');
    }

    const req = http.get(`http://localhost:${PORT}/api/health`, (res) => {
      // Backend server is already running externally
      resolve();
    });

    req.on('error', () => {
      // Start local embedded backend for desktop app
      try {
        const { server } = require('./server');
        embeddedServer = server.listen(PORT, () => {
          console.log(`[Electron] Embedded backend server started on port ${PORT}`);
          resolve();
        });
      } catch (e) {
        console.warn('[Electron] Could not start embedded server:', e.message);
        resolve();
      }
    });
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1380,
    height: 860,
    minWidth: 900,
    minHeight: 600,
    title: "Universal Scroll Compare Pro",
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // Disables X-Frame-Options/CORS blocking for testing external sites
      allowRunningInsecureContent: true
    }
  });

  // Hide default window menu so custom app navigation is used
  Menu.setApplicationMenu(null);

  // Load from local embedded HTTP server so /api/proxy and /api/auth work identically to online mode
  win.loadURL(`http://localhost:${PORT}`).catch(() => {
    win.loadFile(path.join(__dirname, 'index.html'));
  });
}

app.whenReady().then(async () => {
  await ensureBackendServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (embeddedServer) {
    try { embeddedServer.close(); } catch (e) {}
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
