var minify = require('html-minifier').minify;

var result = minify('<p title="blah" id="moo"            >  foo         </p>', {
    conservativeCollapse: true,
    collapseWhitespace: true,
    trimCustomFragments: true,
    useShortDoctype: true,
    collapseInlineTagWhitespace: true,
    removeEmptyElements: true,
    removeComments: true,
    processConditionalComments: true,
    removeEmptyAttributes: true,
    removeRedundantAttributes: true,
    includeAutoGeneratedTags: true,
    html5: true,
    preserveLineBreaks: true
});
console.log(result)