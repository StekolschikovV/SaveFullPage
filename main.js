var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var ipcMain = electron.ipcMain;

var isDev = false;
process.argv.forEach((val, index) => {
    if( val == 'dev'){
        isDev = true;
        // ipcMain.on('asynchronous-message', (event, arg) => {
        //     event.sender.send('asynchronous-reply', 'dev')
        // })
    }
});

var appWindow;
function start() {
    app.on('ready', () => {
        appWindow = new BrowserWindow({
            width: 600,
            height: 800
        });
        appWindow.loadURL(`file://${__dirname}/index.html`);
        // if(isDev)
        //     appWindow.webContents.openDevTools();
    });
    app.on('window-all-closed', function() {
        app.quit();
    });
}
start();
