var _callback = function(){}
var _text = ""
const appVersion = process.env.npm_package_version
const fs = require('fs')
const remark = require('remark')
const remarkHmtl = require('remark-html')
var filepath = `${__dirname}/../documentation/`


/**
 * it's a Helper who take the data and diplay it in a ui
 * @param {object} data
 * @return {void}
 */ 

 exports.setCallback = function(callback){
  _callback = callback
 }


  exports.setSearchedText = function(text){
  _text = text
 }
/**
 * it's a Helper who take the data and diplay it in a ui
 * @param {object} data
 * @return {void}
 */ 

  exports.makeItems = function(data){
    var items = ""

    for(var key in data){
      items += "<div class='note-item'>";
      items += "<h3 class='title'>" + data[key]["title"] + "</h3>"
      items += "<small class='date'>" + data[key]["date"] + "</small>"
      items += "<p class='preview'>" + data[key]["preview"].slice(0,50) + "</p>"
      items += "<p class='tags'>" + data[key]["tags"] + "</p>"
      items += "<div class='body'>" + data[key]["body"] + "</div>"
      items += "<p class='metadata'><span class='lines'>" + data[key]["lines"] + "</span></span>" 

      items += "<div class='erase' data-title='"+ data[key]["title"]+"'> <span class='icon icon-trash'></span></div>"
      items += "</div>";
    }

    $(".notes-list").html(items);
    _callback();
  }

/**
 * it's a Helper who take the data from a search and diplay it in a ui
 * @param {object} data
 * @return {void}
 */ 
  exports.makeSearchedItems = function(data){
    var items = "",
    title,date,preview,tags,
    text = this.searchedText

    for(var key in data){
      title = data[key]["title"].toLowerCase()
      date = data[key]["date"].toLowerCase()
      preview = data[key]["preview"].toLowerCase()
      tags = data[key]["tags"].toLowerCase()

      if(title.includes(_text) ||date.includes(_text) ||preview.includes(_text) || tags.includes(_text)){
        items += "<div class='note-item'>";
        items += "<h3 class='title'>" + data[key]["title"] + "</h3>"
        items += "<small class='date'>" + data[key]["date"] + "</small>"
        items += "<p class='preview'>" + data[key]["preview"].slice(0,50) + "</p>"
        items += "<p class='tags'> <span clas='icon icon-tag'></span>" + data[key]["tags"] + "</p>"
        items += "<div class='body'>" + data[key]["body"] + "</div>"
        items += "<div class='metadata'><span class='lines'>" + data[key]["lines"] + "</span></span>" 

        items += "<div class='erase' data-title='"+ data[key]["title"]+"'> <span class='icon icon-trash'></span></div>"
        items += "</div>";
      }
           
    }

    $(".notes-list").html(items);
    _callback();
  }



  exports.welcomeScreen = function(){
    var html
    
    html = '<div class="welcome-screen">'
    html +='<h3 class="logo"><span class="company">IC</span> <span class="product">Note</span> </h3>'
    html += '<p class="more-info"> <span>Press Enter to write</span></p>' 
    html +=`<p class="info"> <span>${appVersion}</span></p>`
    html += '<p class="more-info"> <a href="">or Read the Turorial</a></p>'
    html += '</div>'
    return html   

  }


  exports.aboutScreen = function(){
    var html = ""
    var about = $("<div>").addClass('about-screen')

    html += '<p class="close"><span class="icon icon-left-open"> </span></p>'
    html += '<div class="block-container">' 
    html += '   <h3 class="logo"><span class="company">IC</span> <span class="product">Not<span class="movable">e</span></span> </h3>'
    html += '</div>'
    html += '<div class="block-container">'  
    html += `   <p class="app-version"> <span>${appVersion}</span></p>`
    html += '</div>'
    html += '<p class="about-nav"><button>Tutorial</button> <button>License</button> <button>Info</button> <button>Thanks To</button></p>'
    html += '<div class="information-container"> </div>'
    html += "<div class='logos'></div>"
    html += '<div class="block-container"><p class="app-version">  Developed  by <span class="author">Jesus Guerrero</span></p></div>'
    html += '<div class=""></div>'

    return about.html(html) 
  }

  exports.getDocumentation = function(documentName){
    var file
    if(documentName == "license"){ 
      file = filepath + "../" + documentName.toUpperCase() + ".md"
    }else{
      file = filepath + documentName + ".md"
    }

    fs.readFile(file,(err,data)=>{
      if(err) throw err
      var mdFile = data.toString(); 
      var htmlFile = remark().use(remarkHmtl).processSync([mdFile].join('\n'))
      $(".information-container").html((String(htmlFile))); 
      lib.externalLinks()
      $(".logos").html(getLogos()); 
    })

  }

  exports.clearDocumentation = function(){}

  function getLogos(){

    var html = "<img src='../assets/img/insanecode_logo_transparent.png' alt='logos'/>"

    return html
  }
