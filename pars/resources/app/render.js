
$(document).ready(function () {
    $('#GET').click(function () {

        // get data
        var url = $('#URL').val();
        var name = $('#NAME').val();

        // lib
        var scrape = require('website-scraper'),
            path = require('path'),
            fs = require('fs');

        // data
        var dir = path.join(__dirname + '../../../', 'save', name),
            options = {
                urls: [url],
                directory: dir
            };

        // get webpage
        scrape(options).then((result) => { alert("ready!") }).catch((err) => { alert(err) });

    });
});