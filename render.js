


$(document).ready(function () {

    console.log('START');

    $( ".loader-block" ).fadeOut( "slow" );

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

    var appInfo = {
        // EVENTS
        events: function () {
            $( "#NAME" ).keyup(function() { $('#dirOnPC').val($(this).val()); $('#dirOnServer').val($(this).val()); });
            appInfo.get();
        },
        // METHODS
        get: function () {
            url = $('#URL').val();
            name = $('#NAME').val();
            dir = path.join(__dirname + '../../../', 'save', name);
            // dir = path.join(__dirname, 'save', name);
        },
        say: function (text) { $.notify(text, { allow_dismiss: false }); },
        fade: function (e) {
            if(e == 'fadeOut') $( ".loader-block" ).fadeOut( 'slow' );
            else $( ".loader-block" ).fadeIn( 'slow' );
        }
    };

    var appPars = {

        // LINE
        line: function () {
            $( ".loader-block" ).fadeIn( "slow" );
            appInfo.get();
            if (fs.existsSync(dir)) { appPars.removeLocalDir(dir); }
            else {
                if ($('#video').is(":checked"))
                {
                    options = {
                        urls: [url],
                        directory: dir
                    };
                } else {
                    options = {
                        urls: [url],
                        directory: dir,
                        sources: [
                            {selector: 'img', attr: 'src'},
                            {selector: 'link[rel="stylesheet"]', attr: 'href'},
                            {selector: 'script', attr: 'src'},
                            {selector: 'video', attr: 'src'}
                        ]
                    };
                }
                // get webpage
                scrape(options).then((result) => { appInfo.say('<strong>ПАРСИНГ УСПЕШЕН!</strong> проверьте папку ' + dir); appInfo.fade("fadeOut");
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
                var Ftp = new JSFtp({
                    host: HOST,
                    port: PORT,
                    user: USERNAME,
                    pass: PASSWORD
                });
                Ftp.ls(".", function(err, res) {
                    var suchFolderIs = false;
                    res.forEach(function(file) {
                        if(file.name == name) {
                            suchFolderIs = true;
                        }
                    });
                    if (suchFolderIs == false) mkd();
                    else upload();
                });

                function mkd() {
                    Ftp.raw("mkd", "/" + dirOnServer, function(err, data) {
                        if (err) { appInfo.say('<strong>ОШИБКА СОЗДНАИЯ ПАПКА НА FTP!</strong> ' + err); appInfo.fade('fadeOut'); }
                        else { appInfo.say('<strong>СОЗДАНА НОВАЯ ПАПКА НА FTP!</strong>'); upload(); }
                    });
                }

                function upload() {
                    var config = {
                        username: Ftp.user,
                        password: Ftp.pass,
                        host: Ftp.host,
                        port: Ftp.port,
                        localRoot: dir,
                        remoteRoot: "/" + dirOnServer
                    };
                    ftpDeploy.deploy(config, function(err) {
                        if (err) { appInfo.say('<strong>ОШИБКА СОЗДНАИЯ ПАПКА НА FTP!</strong> ' + err); appInfo.fade('fadeOut'); }
                        else { appInfo.say('<strong>СОЗДАНА НОВАЯ ПАПКА НА FTP!</strong>'); }
                        $( ".loader-block" ).fadeOut( "slow" );
                    });
                }

            } catch (err){ appInfo.say('<strong>ОШИБКА FTP!</strong> ' + err); appInfo.fade('fadeOut'); }
        },
        // EVENTES
        events: function () {
            $('#FTPUPLOAD').click(function () {
                appFtp.line();
            });
        },
        // METHODS
        get: function () {
            HOST = $('#HOST').val();
            PORT = $('#PORT').val();
            USERNAME = $('#USERNAME').val();
            dirOnServer = $('#dirOnServer').val();
            dirOnPC = $('#dirOnPC').val();
            PASSWORD = $('#PASSWORD').val();
        }
    };

    appInfo.events();
    appPars.events();
    appFtp.events();



    console.log('END');

});