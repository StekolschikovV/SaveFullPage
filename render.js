
$(document).ready(function () {

    console.log('START');

    $( ".loader-block" ).fadeOut( "slow" );

    var url = '',
        name = '',
        dir = '',
        options = '',
        PASSWORD = '',
        HOST = '',
        PORT = '',
        USERNAME = '',
        dirOnServer = '',
        dirOnPC = '',
        scrape = require('website-scraper'),
        path = require('path'),
        fs = require('fs'),
        Fs = fs,
        JSFtp = require("jsftp"),
        Path = path,
        FtpDeploy = require('ftp-deploy'),
        ftpDeploy = new FtpDeploy();

    $('#GET').click(function () {

        $( ".loader-block" ).fadeIn( "slow" );

        // get data
        url = $('#URL').val();
        name = $('#NAME').val();

        // data
        // dir = path.join(__dirname + '../../../', 'save', name), options;
        dir = path.join(__dirname, 'save', name);
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
        scrape(options).then((result) => {
            $( ".loader-block" ).fadeOut( "slow" );
            $.notify('<strong>ПАРСИНГ УСПЕШЕН!</strong> проверьте папку ' + dir, { allow_dismiss: false });
        }).catch((err) => {
            $( ".loader-block" ).fadeOut( "slow" );
            $.notify('<strong>ОШИБКА!</strong> проверьте URL...', { allow_dismiss: false });
        });

    });

    // upload on FTP
    $('#FTPUPLOAD').click(function () {

        $( ".loader-block" ).fadeIn( "slow" );

        HOST = $('#HOST').val();
        PORT = $('#PORT').val();
        USERNAME = $('#USERNAME').val();
        dirOnServer = $('#dirOnServer').val();
        dirOnPC = $('#dirOnPC').val();
        PASSWORD = $('#PASSWORD').val();

        console.log(HOST, PORT, USERNAME, dirOnServer, dirOnPC, PASSWORD);

        try {

            var Ftp = new JSFtp({
                host: HOST,
                port: PORT,
                user: USERNAME,
                pass: PASSWORD
            });

            Ftp.raw("mkd", "/" + dirOnServer, function(err, data) {
                if (err) return console.error(err);
                else upload()
            });

            function upload() {
                var config = {
                    username: Ftp.user,
                    password: Ftp.pass,
                    host: Ftp.host,
                    port: 21,
                    localRoot: Path.join(__dirname, 'save', name),
                    remoteRoot: "/" + dirOnServer
                }
                ftpDeploy.deploy(config, function(err) {
                    if (err) $.notify('<strong>ОШИБКА!</strong> проверьте папку на FTP, проверьте доступ FTP... ' + err, { allow_dismiss: false });
                    else $.notify('<strong>ЗАГРУЗКА УСПЕШЕНА!</strong> проверьте папку ' + dirOnServer, { allow_dismiss: false });

                    $( ".loader-block" ).fadeOut( "slow" );
                });
            }

        } catch (err){
            $( ".loader-block" ).fadeOut( "slow" );
            $.notify('<strong>ОШИБКА!</strong> проверьте папку на FTP, проверьте доступ FTP... ' + err, { allow_dismiss: false });
        }

    });

    // auto dir name
    $( "#NAME" ).keyup(function() {
        $('#dirOnPC').val($(this).val());
        $('#dirOnServer').val($(this).val());
    });

    console.log('END');

});