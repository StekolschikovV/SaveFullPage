var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

app.on('ready', () => {
    appWindow = new BrowserWindow({
        width: 600,
        height: 370
    });
    appWindow.loadURL(`file://${__dirname}/index.html`);
    // appWindow.webContents.openDevTools();
});
app.on('window-all-closed', function() {
    app.quit();
});
