const fs = require('fs')
const remark = require('remark')
const pack = require('../package.json')
const appVersion = pack.version
const remarkHmtl = require('remark-html')
const filepath = __dirname

export default class {

  static setCallback(callback) {
    this.callback = callback
  }

  static setSearchedText(text) {
    this.text = text
  }

  static makeItems(data) {
    let items = " "
    for (var key in data) {
      items += this.theNote(data, key)
    }

    $(".notes-list").html("Cargando.....") 
    console.log('cargando....') 
    console.log(data)

    $(".notes-list").html(items) 
    this.makeFalseLines() 
    return true 
  }

  static makeSearchedItems(data) {
    let items = " "
    let title, date, preview, tags, type
    let text = this.text

    for (let key in data) {
      title = data[key]["title"].toLowerCase()
      date = data[key]["date"].toLowerCase()
      preview = data[key]["preview"].toLowerCase()
      tags = data[key]["tags"].toLowerCase()
      type = data[key]["tags"].toLowerCase()

      if (title.includes(text) || date.includes(text) || preview.includes(text) || tags.includes(text) || type.includes(text)) {
        items += this.theNote(data, key)
      }
    }

    $(".notes-list").html(items) 
    this.makeFalseLines() 
    this.callback()
    return true; 
  }



  static welcomeScreen() {
    let html
    html = '<div class="welcome-screen">'
    html += '<h3 class="logo"><span class="company">IC</span> <span class="product">Note</span> </h3>'
    html += '<p class="more-info"> <span>Press Enter to write</span></p>'
    html += `<p class="info"> <span>${appVersion}</span></p>`
    html += '<p class="more-info"> <a href="">or Read the Turorial</a></p>'
    html += '</div>'
    return html
  }


  static aboutScreen () {
    let html = ""
    let about = $("<div>").addClass('about-screen')

    html += '<p class="close-bar"><span class="close-about icon icon-left-open"> </span></p>'
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

  static getDocumentation(documentName) {
    let file
    console.log(filepath)
    console.log(__dirname)
    if (documentName == "license") {
      file = filepath + "../" + documentName.toUpperCase() + ".md"
    } else {
      file = filepath + documentName + ".md"
    }

    fs.readFile(file, (err, data) => {
      if (err) throw err
      let mdFile = data.toString() 
      let htmlFile = remark().use(remarkHmtl).processSync([mdFile].join('\n'))
      $(".information-container").html((String(htmlFile))) 
      lib.externalLinks()
      $(".logos").html(getLogos()) 
    })

  }


  static getLogos() {
    return "<img src='../assets/img/insanecode_logo_transparent.png' alt='logos'/>"
  }

  static makeFalseLines() {
    let lines = " "

    for (var i = 1;  i < 10 ; i++) {
      lines += `<div class="false-lines num${i}"><span></span></div>`
    }

    $(".false-doc").html(lines)
  }

  static theNote(data, key) {
    let title = data[key]["title"] 
    if (title.length > 13) {
      title = title.slice(0, 12) + '...'
    }
    let item = " "
    item += `<div class="note-item ${data[key]["type"].toLowerCase()}">`
    item += '<div class="preview">'
    item += '<div class="false-doc"></div>'
    item += `<div class="body">${data[key]["body"]}</div>`
    item += '<div class="options">'
    item += `<h2 class="o-title">${data[key]["title"]}</h2>`
    item += `<small class="date">${data[key]["date"] }</small>`
    item += `<a class="action edit-note" href="#">Edit</a> <a class="action read-note" href="#">Read</a>`
    item += '</div>'
    item += '</div>'
    item += '<div class="title-bar">'
    item += `<div class="type">${data[key]["type"]}</div>`
    item += `<h2 class="title">${title}</h2>`
    item += `<div class="delete" ><span class='erase icon icon-trash' data-title="${data[key]["title"]}"></span></div>`
    item += `<div class='metadata'><span class='lines'>${data[key]["lines"]}</span></div>`
    item += '</div>'
    item += "</div>" 
    return item
  }
}