const { app, BrowserWindow } = require('electron');

function createWindow () {
  const win = new BrowserWindow({
        width: 1280,
        height: 720,
        autoHideMenuBar:true,
        skipTaskbar:false,
        webPreferences: {
        nodeIntegration: true
        },
    });
    win.loadFile('index.html');
}

app.whenReady().then(createWindow);