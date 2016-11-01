// Generated by CoffeeScript 1.10.0
(function() {
  var BrowserWindow, app, createWindow, electron, fs, mainWindow;

  electron = require('electron');

  app = electron.app;

  BrowserWindow = electron.BrowserWindow;

  fs = require('fs');

  mainWindow = void 0;

  createWindow = function() {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600
    });
    mainWindow.setMenu(null);
    mainWindow.loadURL("file://" + __dirname + "/index.html");
    mainWindow.webContents.openDevTools();
    return mainWindow.on('closed', function() {
      return mainWindow = void 0;
    });
  };

  app.on('ready', createWindow);

  app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
      return app.quit();
    }
  });

  app.on('activate', function() {
    if (!mainWindow) {
      return createWindow();
    }
  });

}).call(this);

//# sourceMappingURL=main.js.map