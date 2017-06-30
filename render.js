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
var del = require('del');
var minify = require('html-minifier').minify;

// --- --- --- conf and data
var confAndData = {};
// conf and data --- --- ---

// --- --- --- appInfo
var appInfo = {
    // VARS
    fileName: 'data.json',
    obj: '',
    lastFaid: '',
    linksToPicturesThatNeedToBeChanged: [],
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
        $( "input" ).change(function() { appInfo.writeToJson(); });
    },
    // METHODS
    get: function () {
        url = $('#URL').val(); name = $('#NAME').val();
        // dir = path.join(__dirname + '../../../', 'save', name);
        dir = path.join(__dirname, 'save', name);
    }, say: function (text) {
        $.notify(text, { allow_dismiss: false });
        var audio = new Audio(); audio.src = 'viber.mp3'; audio.autoplay = true;
    }, fade: function (e) {
        if(e == 'fadeOut') { $( ".loader-block" ).fadeOut( 'slow' ); appInfo.lastFaid = 'fadeOut'; }
        else { $( ".loader-block" ).fadeIn( 'slow' ); appInfo.lastFaid = 'fadeIn'; }
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
        $('#minifyHtml').prop('checked', confAndData['minifyHtml']);
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
            dirOnPC_TOW: $('#dirOnPC_TOW').val(),
            minifyHtml: $('#minifyHtml').prop('checked')
        }
        jsonfile.writeFile(appInfo.fileName, writeToJsonObj, function (err) { });
    }
};
// appInfo --- --- ---

// --- --- --- appPars
var appPars = {
    // VARS
    neadClickPars: false,
    tmpVideoUrl: '',
    // LINE
    line: function () {
        appInfo.fade("fadeIn")
        appInfo.get();
        if (fs.existsSync(dir)) {
            appPars.removeLocalDir(dir);
        }
        else {

            if ($('#video').is(":checked")) { options = { urls: [url], directory: dir }; }
            else {
                options = {
                    urls: [url], directory: dir, sources: [
                        {selector: 'img', attr: 'src'}, {selector: 'link[rel="stylesheet"]', attr: 'href'},
                        {selector: 'script', attr: 'src'}, {selector: 'video', attr: 'src'} ],
                    onResourceSaved: (resource) => {
                        if(resource.url.indexOf('http://play999.ru/index.php') + 1) { appPars.tmpVideoUrl = resource; }
                        if(
                            resource.url.indexOf('.png') != -1 ||
                            resource.url.indexOf('.gif') != -1 ||
                            resource.url.indexOf('.jpg') != -1
                        ) {
                            var str = resource.filename.replace("\\","/");
                            appInfo.linksToPicturesThatNeedToBeChanged.push( str );
                        }
                    }
                };
            }
            // get webpage
            scrape(options).then((result) => {
                appInfo.say('<strong>ПАРСИНГ УСПЕШЕН!</strong> проверьте папку ' + dir);
                appInfo.fade("fadeOut");

                if(appPars.neadClickPars == true) {
                    appPars.neadClickPars = false;
                    $('#FTPTASKER').click();
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
// appPars --- --- ---

// --- --- --- appFtp
var appFtp = {
    // LINE
    line: function () {
        appFtp.get();
        appInfo.fade("fadeIn");
        try {
            var Ftp = new JSFtp({ host: HOST, port: PORT, user: USERNAME, pass: PASSWORD });
            Ftp.ls(".", function(err, res) {
                var suchFolderIs = false;
                res.forEach(function(file) { if(file.name == name) { suchFolderIs = true; } });
                if(suchFolderIs){
                    var result = confirm('На хочтинге есть уже такая папка. Заменить ее?');
                    if(result){
                        upload();
                    } else {
                        location.reload();
                    }
                } else {
                    if (suchFolderIs == false) mkd();
                    else upload();
                }
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
// appFtp --- --- ---

// --- --- --- appFtpTwo
var appFtpTwo = {
    // LINE
    line: function () {
        appFtpTwo.get();

        appInfo.fade("fadeIn");
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
                var config = {
                    username: Ftp.user,
                    password: Ftp.pass,
                    host: Ftp.host,
                    port: Ftp.port,
                    localRoot: dir,
                    remoteRoot: "/" + dirOnServer };
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
// appFtpTwo --- --- ---

// --- --- --- appFtpTasker
var appFtpTasker = {
    ftpRoundId: [],
    // LINE
    line: function () {
        appInfo.fade('fadeIn');
        appFtpTasker.checkFtpSelectSection();
        if(appFtpTasker.ftpRoundId.length == 0) {
            appInfo.say('<strong>НИЧЕГО НЕТ В ОЧЕРЕДИ!</strong> '); appInfo.fade('fadeOut');
        } else {
            appInfo.say('<strong>В ОЧЕРЕДИ ЕСТЬ ЭЛЕМЕНТЫ - </strong> ' + appFtpTasker.ftpRoundId.length);
            appFtpTasker.preClickOnParsBt();
        }
    },
    // EVENTS
    events: function () {
        $('#FTPTASKER').click(function () {
            appFtpTasker.line();
        });
        $('#GETANDFTPTASKER').click(function () {
            appPars.neadClickPars = true;
            $('#GET').click();
        });
    },
    // METHODS
    checkFtpSelectSection: function () {
        appFtpTasker.ftpRoundId = [];
        $( ".ftpRound" ).each(function( index ) {
            if ($(this).is(":checked")) { appFtpTasker.ftpRoundId.push($(this).data('id')); }
        });
    }, preClickOnParsBt: function () {

        if(appFtpTasker.ftpRoundId.length == 2) {
            fs.readFile(path.join(dir, 'index.html'), 'utf8', function (err, data) {
                for (var i = 0; appInfo.linksToPicturesThatNeedToBeChanged.length > i; i++) {
                    data = data.replace( appInfo.linksToPicturesThatNeedToBeChanged[i], 'http://imgkonst1.pw/' + name + '/' + appInfo.linksToPicturesThatNeedToBeChanged[i] );
                }
                if(appPars.tmpVideoUrl != '')
                    data = data.replace(appPars.tmpVideoUrl.filename,appPars.tmpVideoUrl.url);
                appPars.tmpVideoUrl == '';
                fs.unlink(path.join(dir, 'index.html'), function(err, result) {
                    if (fs.existsSync( path.join(dir, 'index.php') ))
                        fs.unlink(path.join(dir, 'index.php'), function(err, result) {
                            if( confAndData.minifyHtml ){
                                data = minify( data , {
                                    conservativeCollapse: true,
                                    collapseWhitespace: true,
                                    trimCustomFragments: true,
                                    useShortDoctype: true,
                                    collapseInlineTagWhitespace: true,
                                    // removeEmptyElements: true,
                                    removeComments: true,
                                    processConditionalComments: true,
                                    removeEmptyAttributes: true,
                                    removeRedundantAttributes: true,
                                    includeAutoGeneratedTags: true,
                                    html5: true,
                                    minifyCSS: true,
                                    minifyJS: true,
                                    preserveLineBreaks: true
                                });
                            }
                            fs.writeFile(path.join(dir, 'index.php'), data, function(err) {
                                appFtpTasker.clickOnParsBtn();
                            });
                        });
                });

            });
        } else if(appFtpTasker.ftpRoundId.length == 1){
            fs.readFile(path.join(dir, 'index.php'), 'utf8', function (err, data) {
                data = data.replace( /imgkonst1/g, 'imgkonst2' );
                appPars.tmpVideoUrl == '';
                fs.writeFile(path.join(dir, 'index.php'), data, function(err) {
                    appFtpTasker.clickOnParsBtn();
                });

            });
        }

    }, clickOnParsBtn: function () {
        $('.' + appFtpTasker.ftpRoundId[0]).click();
        appFtpTasker.rmCheckBoxSelect(appFtpTasker.ftpRoundId[0])
        var timer = setInterval(function () {
            if(appInfo.lastFaid == 'fadeOut') {
                if(appFtpTasker.ftpRoundId.length > 0){
                    appFtpTasker.line();
                } else {
                    clearTimeout(timer);
                    setTimeout(function () {
                        location.reload();
                    }, 1000);
                }
            }
        }, 2000);
    }, rmCheckBoxSelect: function (id) {
        $( ".ftpRound" ).each(function( index ) {
            if ($(this).data('id') == id) { $(this).prop("checked", false); }
        });
    }
}
// appFtpTwo --- --- ---

$(document).ready(function () {
    appInfo.fade("fadeOut");
    appInfo.line();
    appInfo.events();
    appPars.events();
    appFtp.events();
    appFtpTwo.events();
    appFtpTasker.events();
});




// var aaa = require('./lib/rrr.js');
// console.log(aaa)
// console.log(aaa.aaa)