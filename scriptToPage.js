// if(window.location.search != '' && window.location.search.indexOf('?ref=') > -1) {
//     var ref = window.location.search.replace('?ref=', '');
//     function updateURLParameter(url, param, paramVal){
//         var newAdditionalURL = "";
//         var tempArray = url.split("?");
//         var baseURL = tempArray[0];
//         var additionalURL = tempArray[1];
//         var temp = "";
//         if (additionalURL) {
//             tempArray = additionalURL.split("&");
//             for (var i=0; i<tempArray.length; i++){
//                 if(tempArray[i].split('=')[0] != param){
//                     newAdditionalURL += temp + tempArray[i];
//                     temp = "&";
//                 }
//             }
//         }
//         var rows_txt = temp + "" + param + "=" + paramVal;
//         return baseURL + "?" + newAdditionalURL + rows_txt;
//     }
//     var newParam = updateURLParameter(window.location.href.replace('?ref=001', '' ), "ref", ref);
//     var newUrl = document.getElementsByClassName("appenJs")[0].src.replace( 'http://plmvol.ru/index.php?crossorigin=1224', newParam );
//     document.getElementsByClassName("appenJs")[0].src = newUrl;
// } else {
//     console.log(window.location.search);
//     document.body.innerHTML = "";
//     var elem = document.createElement("img");
//     elem.src = 'http://lamcdn.net/lookatme.ru/post-cover/hkklqQ0vaxY6ir9uFo5ofA-default.png';
//     elem.id = "BG";
//     document.body.appendChild(elem);
//     BG.style.width = '100%';
//     BG.style.position = "absolute";
//     BG.style.right = "0";
//     BG.style.left = "0";
//     BG.style.top = "0";
//     BG.style.bottom = "0";
//     BG.style.margin = "auto";
//     document.body.style.background = '#0708ff';
//     document.body.style.overflow = 'hidden';
// }


// var ref = '?ref=001'; // window.location.search
// var refInt = ref.replace( '?ref=', '' ); // 001
// var urlVideo = 'http://plmvol.ru/index.php?crossorigin=1224&init=3115::74315'; // document.getElementsByClassName("appenJs")[0].src
// // get old id
// var from = urlVideo.search('crossorigin=');
// var to = urlVideo.length;
// var SrtT = urlVideo.substring(from + 12,to);// 1224&init=3115::74315
// var fromT = 0;
// var toT = SrtT.search('&');
// var idOld = SrtT.substring(fromT ,toT);
// var urlAndNewId = document.getElementsByClassName("appenJs")[0].src.replace( idOld, refInt );
// document.getElementsByClassName("appenJs")[0].src = urlAndNewId;












// document.body.style.display = 'none';
// if(window.location.search != '' && window.location.search.indexOf('?ref=') > -1) {
//     // --- --- --- change ID --- --- ---
//         var ref = window.location.search; // window.location.search
//         var refInt = ref.replace( '?ref=', '' ); // 001
//         var urlVideo = document.getElementsByClassName("appenJs")[0].src; // document.getElementsByClassName("appenJs")[0].src
//     // get old id
//         var from = urlVideo.search('crossorigin=');
//         var to = urlVideo.length;
//         var SrtT = urlVideo.substring(from + 12,to);// 1224&init=3115::74315
//         var fromT = 0;
//         var toT = SrtT.search('&');
//         var idOld = SrtT.substring(fromT ,toT);
//         var urlAndNewId = document.getElementsByClassName("appenJs")[0].src.replace( idOld, refInt );
//         document.getElementsByClassName("appenJs")[0].src = urlAndNewId;
//         document.body.style.display = 'block';
//     // --- --- --- change ID --- --- ---
// } else {
//     document.body.innerHTML = "";
//     var elem = document.createElement("img");
//     elem.src = 'http://lamcdn.net/lookatme.ru/post-cover/hkklqQ0vaxY6ir9uFo5ofA-default.png';
//     elem.id = "BG";
//     document.body.appendChild(elem);
//     BG.style.width = '100%';
//     BG.style.position = "absolute";
//     BG.style.right = "0";
//     BG.style.left = "0";
//     BG.style.top = "0";
//     BG.style.bottom = "0";
//     BG.style.margin = "auto";
//     document.body.style.background = '#0708ff';
//     document.body.style.overflow = 'hidden';
//     document.body.style.display = 'block';
// }


// var fs = require('fs');
// var imagemin = require('image-min');
var path = require('path');
var fs = require('fs');

var fP = path.join( __dirname, 'save', 'v281', 'images' );
var fPs = path.join( __dirname, 'save', 'v281', 'images', '*' );
var filePath = path.join( __dirname, 'save', 'v281', 'images');
var filePath2 = path.join( __dirname, 'save', 'v281', 'images', '2.jpg');
var filePath3 = path.join( __dirname, 'save', 'v281', 'images', '3.jpg');

// var gm = require('gm');

// var rs = fs.readFileSync(filePath, 'utf8');
// var wstream = fs.createWriteStream(filePath2);
// gm(rs).options({imageMagick: true}).write(wstream, function (err) {
//     if (!err) console.log('Done');
//     else console.log(err);
// })

const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const image = require('gulp-image');


console.log(fPs)

    gulp.src(fPs)
        .pipe(image({
            pngquant: false,
            optipng: false,
            zopflipng: false,
            jpegRecompress: false,
            jpegoptim: false,
            mozjpeg: false,
            guetzli: false,
            gifsicle: false,
            svgo: false,
            // concurrent: 10

            // pngquant: true,
            // optipng: true,
            // zopflipng: true,
            // jpegRecompress: true,
            // jpegoptim: true,
            // mozjpeg: true,
            // guetzli: false,
            // gifsicle: true,
            // svgo: true,
            // concurrent: 10
        }))
        .pipe(gulp.dest(filePath))
