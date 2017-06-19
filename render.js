
$(document).ready(function () {

    $( ".loader-block" ).fadeOut( "slow" );

    $('#GET').click(function () {

        console.log('START');

        $( ".loader-block" ).fadeIn( "slow" );

        // get data
        var url = $('#URL').val();
        var name = $('#NAME').val();

        // lib
        var scrape = require('website-scraper'),
            path = require('path'),
            fs = require('fs');

        // data
        var dir = path.join(__dirname + '../../../', 'save', name), options;
        // var dir = path.join(__dirname, 'save', name), options;
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
        
        // get slider img
        // function getSliderImg() {
        //     console.log('START getSliderImg');
        //     fs.readFile(path.join(__dirname, 'save', name) + '/index.html', 'utf8', function (err,data) {
        //         try {
        //             var $str1 = $(data);
        //             $str1.find('img').each(function( index, element ) {
        //                 text = $(element).attr( "src").replace('images/','');
        //                 fs.mkdirSync(path.join(__dirname, 'save', name, 'gallery_gen'));
        //                 var download = require('image-downloader')
        //                 var options = {
        //                     url: url + '/gallery_gen/' + text,
        //                     dest: path.join(__dirname, 'save', name, 'gallery_gen')
        //                 }
        //                 download.image(options)
        //                     .then(({ filename, image }) => {
        //                         console.log('File saved to', filename)
        //                     }).catch((err) => {
        //                 })
        //             });
        //         } catch (err) {}
        //     });
        // }


        console.log('END');
    });
});