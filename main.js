"use strict";

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");

// Chromium cannot open its caches inside a synced folder, because OneDrive
// holds the files while Chromium moves them.
app.setPath("userData", path.join(app.getPath("appData"), "OpenGraph"));

let window_ = null;

function createWindow() {
  window_ = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: "#ffffff",
    // The title bar is drawn in the page, so the menu and the window buttons
    // sit on one row the way the design has them.
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  window_.loadFile("index.html");
}

ipcMain.on("window", (_event, action) => {
  if (!window_) return;
  if (action === "minimize") window_.minimize();
  if (action === "maximize") window_.isMaximized() ? window_.unmaximize() : window_.maximize();
  if (action === "close") window_.close();
});

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
