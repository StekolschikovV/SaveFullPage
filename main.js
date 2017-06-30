var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

var isDev = false;
process.argv.forEach((val, index) => {
    if( val == 'dev')
        isDev = true;
});

function start() {
    app.on('ready', () => {
        appWindow = new BrowserWindow({
            width: 600,
            height: 846
        });
        appWindow.loadURL(`file://${__dirname}/index.html`);
        if(isDev)
            appWindow.webContents.openDevTools();
    });
    app.on('window-all-closed', function() {
        app.quit();
    });
}
start();