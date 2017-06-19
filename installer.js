//
//
// var installer = require('electron-installer-windows')
//
// var options = {
//     src: './pars',
//     dest: './'
// }
//
// console.log('Creating package (this may take a while)')
//
// installer(options, function (err) {
//     if (err) {
//         console.error(err, err.stack)
//         process.exit(1)
//     }
//
//     console.log('Successfully created package at ' + options.dest)
// })

var electronInstaller = require('electron-winstaller');
resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: '/pars',
    outputDirectory: '/res',
    authors: 'My App Inc.',
    exe: 'myapp.exe'
});

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));