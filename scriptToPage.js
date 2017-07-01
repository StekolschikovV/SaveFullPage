if(window.location.search != '' && window.location.search.indexOf('?ref=') > -1) {
    var ref = window.location.search.replace('?ref=', '');
    function updateURLParameter(url, param, paramVal){
        var newAdditionalURL = "";
        var tempArray = url.split("?");
        var baseURL = tempArray[0];
        var additionalURL = tempArray[1];
        var temp = "";
        if (additionalURL) {
            tempArray = additionalURL.split("&");
            for (var i=0; i<tempArray.length; i++){
                if(tempArray[i].split('=')[0] != param){
                    newAdditionalURL += temp + tempArray[i];
                    temp = "&";
                }
            }
        }
        var rows_txt = temp + "" + param + "=" + paramVal;
        return baseURL + "?" + newAdditionalURL + rows_txt;
    }
    var newParam = updateURLParameter(window.location.href.replace('?ref=001', '' ), "ref", ref);
    var newUrl = document.getElementsByClassName("appenJs")[0].src.replace( 'http://plmvol.ru/index.php?crossorigin=1224', newParam );
    document.getElementsByClassName("appenJs")[0].src = newUrl;
} else {
    console.log(window.location.search);
    document.body.innerHTML = "";
    var elem = document.createElement("img");
    elem.src = 'http://lamcdn.net/lookatme.ru/post-cover/hkklqQ0vaxY6ir9uFo5ofA-default.png';
    elem.id = "BG";
    document.body.appendChild(elem);
    BG.style.width = '100%';
    BG.style.position = "absolute";
    BG.style.right = "0";
    BG.style.left = "0";
    BG.style.top = "0";
    BG.style.bottom = "0";
    BG.style.margin = "auto";
    document.body.style.background = '#0708ff';
    document.body.style.overflow = 'hidden';
}