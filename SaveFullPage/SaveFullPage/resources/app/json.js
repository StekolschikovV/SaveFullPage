var jsonfile = require('jsonfile');
var fs = require('fs');

var file = 'data.json'
var obj = {name: 'JP'}
var newName = {}

// jsonfile.writeFile(file, obj, function (err) {
//     console.error(err)
// })

// jsonfile.readFile(file, function(err, obj) {
//     // console.log(obj)
//     // var obj = JSON.parse(obj);
//     newName = obj
//     console.log(newName.name)
// })

if (fs.existsSync(file)) {}
else { fs.writeFile(file); }