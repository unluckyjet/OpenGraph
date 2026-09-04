"use strict";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("opengraph", {
  window: (action) => ipcRenderer.send("window", action),
});
