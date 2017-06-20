var JSFtp = require("jsftp");
var Path = require('path');
var Fs = require('fs');
var FtpDeploy = require('ftp-deploy');
var ftpDeploy = new FtpDeploy();

var Ftp = new JSFtp({
    host: "213.202.233.42",
    port: 21,
    user: "konstruktor",
    pass: "KLONew89hf"
});


Ftp.raw("mkd", "/new_dir", function(err, data) {
    if (err) return console.error(err);
    else upload()
});

function upload() {
    var config = {
        username: Ftp.user,
        password: Ftp.pass, // optional, prompted if none given
        host: Ftp.host,
        port: 21,
        localRoot: Path.join(__dirname, 'save', '123'),
        remoteRoot: "/new_dir"
    }
    ftpDeploy.deploy(config, function(err) {
        if (err) console.log(err)
        else console.log('finished');
    });
}
