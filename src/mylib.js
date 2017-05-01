const {shell} = require('electron')

// focus line and go to the end of the line
exports.focusElement = function(el){  
  var classname = el.attr("class").split(" ").join('\.');
  el = document.querySelector("." + classname); 
  
  el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}


exports.getSqlDateNow =function(){
    var date = new Date();
    var d,m,y = date.getFullYear();
    m = date.toString().slice(3,7);
    d = date.toString().slice(8,10);
    date = y + " " + m + " " + d;

    return date;
}


exports.externalLinks = function getAllLinks () {
  links = document.querySelectorAll('a[href]')
  Array.prototype.forEach.call(links, function (link) {
    const url = link.getAttribute('href')
    if (url.indexOf('http') === 0) {
      link.addEventListener('click', function (e) {
        e.preventDefault()
        shell.openExternal(url)
      })
    }
  })
}