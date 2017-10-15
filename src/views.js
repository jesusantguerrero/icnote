const fs = require('fs')
const remark = require('remark')
const pack = require('../package.json')
const appVersion = pack.version
const remarkHmtl = require('remark-html')
const filepath = './documentation/'

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
    let html = `
      <div class="welcome-screen">'
        <h3 class="logo"><span class="company">IC</span> <span class="product">Note</span> </h3>
        <p class="more-info"> <span>Press Enter to write</span></p>
        <p class="info"> <span>${appVersion}</span></p>
      </div>`
    return html
  }


  static aboutScreen () {
    let about = $("<div>").addClass('about-screen')

    let html = `
      <p class="close-bar"><span class="close-about icon icon-left-open"> </span></p>
      <div class="block-container">
         <h3 class="logo"><span class="company">IC</span> <span class="product">Not<span class="movable">e</span></span> </h3>
      </div>
      <div class="block-container">
         <p class="app-version"> <span>${appVersion}</span></p>
      </div>
      <p class="about-nav"><button>Tutorial</button> <button>License</button> <button>Info</button> <button>Thanks To</button></p>
      <div class="information-container"> </div>
      <div class='logos'></div>
      <div class="block-container"><p class="app-version">  Developed  by <span class="author">Jesus Guerrero</span></p></div>
      <div class=""></div>`

    return about.html(html)
  }

  static getDocumentation(documentName) {
    let file
    const self = this
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
      $(".logos").html(this.getLogos()) 
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
    let item = `
    <div class="note-item ${data[key]["type"].toLowerCase()}">
      <div class="preview">
        <div class="false-doc"></div>
        <div class="body">${data[key]["body"]}</div>
        <div class="options">
          <h2 class="o-title">${data[key]["title"]}</h2>
          <small class="date">${data[key]["date"] }</small>
          <a class="action edit-note" href="#">Edit</a> <a class="action read-note" href="#">Read</a>
        </div>
      </div>
      <div class="title-bar">
        <div class="type">${data[key]["type"]}</div>
        <h2 class="title">${title}</h2>
        <div class="delete" ><span class='erase icon icon-trash' data-title="${data[key]["title"]}"></span></div>
        <div class='metadata'><span class='lines'>${data[key]["lines"]}</span></div>
      </div>
    </div>
    `
    return item
  }
}