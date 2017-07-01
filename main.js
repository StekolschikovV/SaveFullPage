var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var ipcMain = electron.ipcMain;

var isDev = false;
process.argv.forEach((val, index) => {
    if( val == 'dev')
        isDev = true;
});

var appWindow;
function start() {
    app.on('ready', () => {
        appWindow = new BrowserWindow({
            width: 600,
            height: 800
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




// ipcMain.on('synchronous-message', (event, arg) => {
//     console.log(arg)  // prints "ping"
//
//     event.returnValue = true;
// })

