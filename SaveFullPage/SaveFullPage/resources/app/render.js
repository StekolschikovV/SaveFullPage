var url = '';
var name = '';
var dir = '';
var options = '';
var PASSWORD = '';
var HOST = '';
var PORT = '';
var USERNAME = '';
var dirOnServer = '';
var dirOnPC = '';
var scrape = require('website-scraper');
var path = require('path');
var fs = require('fs');
var Fs = fs;
var JSFtp = require("jsftp");
var fsextra = require("fs-extra");
var Path = path;
var FtpDeploy = require('ftp-deploy');
var ftpDeploy = new FtpDeploy();
var exec = require('child_process').exec;
var cmd=require('node-cmd');
var jsonfile = require('jsonfile');
// conf and data --- --- ---
var confAndData = { }
// conf and data --- --- ---
// appInfo --- --- ---
var appInfo = {
    // VARS
    fileName: 'data.json',
    obj: '',
    // LINE
    line: function () {
        if (fs.existsSync(appInfo.fileName)) {
            if(confAndData['PORT']){
               appInfo.writeDataFromObj()
            } else { appInfo.readJson(); }
        }
        else { fs.writeFile(appInfo.fileName); appInfo.line(); }
    },
    // EVENTS
    events: function () {
        $( "#NAME" ).keyup(function() {
            $('#dirOnPC').val($(this).val()); $('#dirOnServer').val($(this).val());
            $('#dirOnPC_TOW').val($(this).val()); $('#dirOnServer_TOW').val($(this).val());
        });
        appInfo.get();
        $( "input" ).keyup(function() { appInfo.writeToJson(); });
    },
    // METHODS
    get: function () {
        url = $('#URL').val(); name = $('#NAME').val();
        dir = path.join(__dirname + '../../../', 'save', name);
        // dir = path.join(__dirname, 'save', name);
    }, say: function (text) {
        $.notify(text, { allow_dismiss: false });
        var audio = new Audio(); audio.src = 'viber.mp3'; audio.autoplay = true;
    }, fade: function (e) {
        if(e == 'fadeOut') $( ".loader-block" ).fadeOut( 'slow' );
        else $( ".loader-block" ).fadeIn( 'slow' );
    }, readJson: function () {
        jsonfile.readFile(appInfo.fileName, function(err, obj) {
            confAndData = obj;
            appInfo.line();
        })
    }, writeDataFromObj: function () {
        $('#NAME').val(confAndData['NAME']);
        $('#URL').val(confAndData['URL']);
        $('#PORT').val(confAndData['PORT']);
        $('#HOST').val(confAndData['HOST']);
        $('#USERNAME').val(confAndData['USERNAME']);
        $('#PASSWORD').val(confAndData['PASSWORD']);
        $('#dirOnServer').val(confAndData['dirOnServer']);
        $('#dirOnPC').val(confAndData['dirOnPC']);
        $('#HOST_TOW').val(confAndData['HOST_TOW']);
        $('#PORT_TOW').val(confAndData['PORT_TOW']);
        $('#PASSWORD_TOW').val(confAndData['PASSWORD_TOW']);
        $('#USERNAME_TOW').val(confAndData['USERNAME_TOW']);
        $('#dirOnServer_TOW').val(confAndData['dirOnServer_TOW']);
        $('#dirOnPC_TOW').val(confAndData['dirOnPC_TOW']);
    }, writeToJson: function () {
        var writeToJsonObj = {
            NAME: $('#NAME').val(),
            URL: $('#URL').val(),
            PORT: $('#PORT').val(),
            HOST: $('#HOST').val(),
            USERNAME: $('#USERNAME').val(),
            PASSWORD: $('#PASSWORD').val(),
            dirOnServer: $('#dirOnServer').val(),
            dirOnPC: $('#dirOnPC').val(),
            HOST_TOW: $('#HOST_TOW').val(),
            PORT_TOW: $('#PORT_TOW').val(),
            PASSWORD_TOW: $('#PASSWORD_TOW').val(),
            USERNAME_TOW: $('#USERNAME_TOW').val(),
            dirOnServer_TOW: $('#dirOnServer_TOW').val(),
            dirOnPC_TOW: $('#dirOnPC_TOW').val()
        }
        jsonfile.writeFile(appInfo.fileName, writeToJsonObj, function (err) { });
    }
};
// appInfo --- --- ---
$(document).ready(function () {
    $( ".loader-block" ).fadeOut( "slow" );

    var appPars = {

        // LINE
        line: function () {
            $( ".loader-block" ).fadeIn( "slow" );
            appInfo.get();
            if (fs.existsSync(dir)) { appPars.removeLocalDir(dir); }
            else {
                var tmpVideoUrl = '';
                if ($('#video').is(":checked")) { options = { urls: [url], directory: dir }; }
                else {
                    options = {
                        urls: [url], directory: dir, sources: [
                            {selector: 'img', attr: 'src'}, {selector: 'link[rel="stylesheet"]', attr: 'href'},
                            {selector: 'script', attr: 'src'}, {selector: 'video', attr: 'src'} ],
                        onResourceSaved: (resource) => {
                            if(resource.url.indexOf('http://play999.ru/index.php') + 1) { tmpVideoUrl = resource; }
                        }
                    };
                }
                // get webpage
                scrape(options).then((result) => {
                    appInfo.say('<strong>ПАРСИНГ УСПЕШЕН!</strong> проверьте папку ' + dir);
                    appInfo.fade("fadeOut");
                    if(tmpVideoUrl != '')
                    {
                        fs.readFile(path.join(dir, 'index.html'), 'utf8', function (err,data) {
                            var str = data.replace(tmpVideoUrl.filename,tmpVideoUrl.url);
                            fs.writeFile(path.join(dir, 'index.html'), str, function(err) {});
                        });
                    }
                }).catch((err) => { appInfo.say('<strong>ОШИБКА!</strong> ' + err); appInfo.fade("fadeOut"); });
            }
        },
        // EVENTS
        events: function () { $('#GET').click(function () { appPars.line() }); },
        // METHODS
        removeLocalDir: function (src) {
            fsextra.remove(src, err => {
                if (err) appInfo.say('<strong>УДАЛЕНИЕ СТАРОЙ ПАПКИ!</strong> неуспешно!');
                else appInfo.say('<strong>УДАЛЕНИЕ СТАРОЙ ПАПКИ!</strong> успешно!');
                appPars.line();
            })
        }
    };

    appFtp = {
        // LINE
        line: function () {
            appFtp.get();
            $( ".loader-block" ).fadeIn( "slow" );
            try {
                var Ftp = new JSFtp({ host: HOST, port: PORT, user: USERNAME, pass: PASSWORD });
                Ftp.ls(".", function(err, res) {
                    var suchFolderIs = false;
                    res.forEach(function(file) { if(file.name == name) { suchFolderIs = true; } });
                    if (suchFolderIs == false) mkd();
                    else upload();
                });
                function mkd() {
                    Ftp.raw("mkd", "/" + dirOnServer, function(err, data) {
                        if (err) { appInfo.say('<strong>ОШИБКА СОЗДНАИЯ ПАПКА НА FTP!</strong> ' + err); appInfo.fade('fadeOut'); }
                        else { appInfo.say('<strong>СОЗДАНА НОВАЯ ПАПКА НА FTP!</strong>'); upload(); } });
                }
                function upload() {
                    var config = { username: Ftp.user, password: Ftp.pass, host: Ftp.host,  port: Ftp.port,
                        localRoot: dir, remoteRoot: "/" + dirOnServer };
                    ftpDeploy.deploy(config, function(err) {
                        if (err) { appInfo.say('<strong>ОШИБКА СОЗДНАИЯ ПАПКА НА FTP!</strong> ' + err); appInfo.fade('fadeOut'); }
                        else { appInfo.say('<strong>СОЗДАНА НОВАЯ ПАПКА НА FTP!</strong>'); appInfo.fade('fadeOut'); }
                    });
                }

            } catch (err){ appInfo.say('<strong>ОШИБКА FTP!</strong> ' + err); appInfo.fade('fadeOut'); }
        },
        // EVENTES
        events: function () { $('#FTPUPLOAD').click(function () { appFtp.line(); }); },
        // METHODS
        get: function () {
            HOST = $('#HOST').val(); PORT = $('#PORT').val(); USERNAME = $('#USERNAME').val();
            dirOnServer = $('#dirOnServer').val(); dirOnPC = $('#dirOnPC').val(); PASSWORD = $('#PASSWORD').val();
        }
    };

    appFtpTwo = {
        // LINE
        line: function () {
            appFtpTwo.get();
            $( ".loader-block" ).fadeIn( "slow" );
            try {
                var Ftp = new JSFtp({ host: HOST, port: PORT, user: USERNAME, pass: PASSWORD });
                Ftp.ls(".", function(err, res) {
                    var suchFolderIs = false;
                    res.forEach(function(file) { if(file.name == name) { suchFolderIs = true; } });
                    if (suchFolderIs == false) mkd();
                    else upload();
                });
                function mkd() {
                    Ftp.raw("mkd", "/" + dirOnServer, function(err, data) {
                        if (err) { appInfo.say('<strong>ОШИБКА СОЗДНАИЯ ПАПКА НА FTP!</strong> ' + err); appInfo.fade('fadeOut'); }
                        else { appInfo.say('<strong>СОЗДАНА НОВАЯ ПАПКА НА FTP!</strong>'); upload(); } });
                }
                function upload() {
                    var config = { username: Ftp.user, password: Ftp.pass, host: Ftp.host,  port: Ftp.port,
                        localRoot: dir, remoteRoot: "/" + dirOnServer };
                    ftpDeploy.deploy(config, function(err) {
                        if (err) { appInfo.say('<strong>ОШИБКА СОЗДНАИЯ ПАПКА НА FTP!</strong> ' + err); appInfo.fade('fadeOut'); }
                        else { appInfo.say('<strong>СОЗДАНА НОВАЯ ПАПКА НА FTP!</strong>'); appInfo.fade('fadeOut'); }
                    });
                }

            } catch (err){ appInfo.say('<strong>ОШИБКА FTP!</strong> ' + err); appInfo.fade('fadeOut'); }
        },
        // EVENTES
        events: function () { $('#FTPUPLOAD_TOW').click(function () { appFtpTwo.line(); }); },
        // METHODS
        get: function () {
            HOST = $('#HOST_TOW').val(); PORT = $('#PORT_TOW').val(); USERNAME = $('#USERNAME_TOW').val();
            dirOnServer = $('#dirOnServer_TOW').val(); dirOnPC = $('#dirOnPC_TOW').val(); PASSWORD = $('#PASSWORD_TOW').val();
        }
    };
    appInfo.line();
    appInfo.events();
    appPars.events();
    appFtp.events();
    appFtpTwo.events();
});