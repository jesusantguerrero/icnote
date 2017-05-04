const notifications = require('./notifications.js')
const notification = new notifications.init()
const myDB = require('./myDB.js')
const DB = new myDB.DB(notification)
const wconverter = require('./wconverter.js')
const lib = require('./mylib.js')

// the DOM Elements

var editor = $('#editor')
var docTitle = $('#doc-title')
var preferences = $('.editor-preferences')
var noteListBox = $('.notes-list-box')
var btnMenu = $('#btn-menu')
var btnTrash = $('#btn-trash')
var btnSave = $('#btn-save-note')
var btnPreferences = $('#btn-preferences')
var btnMaximaze = $('#btn-maximaze')
var btnMinimaze = $('#btn-minimaze')
var btnClose = $('#btn-close')
var searchbar = $(".searchbar")


// the context vars
const SMOOTHSAVE = true
var line = 0
var temp
var key
var lineElement
var oldLine
var listNumber
var modoEscritura = false
var widthTable
var is_preferences = false
var is_menu = false


getTyping()
/**
 * this is where the magic happens gettyping controls what happens when you type in the editor
 * convertions,addlines, remove lines, etc
 */
function getTyping () {
  var keys = {
        ENTER: 13,
        BACKSPACE: 8,
        TAB: 9,
        lParenthesis: 40,
        lBracket: 91,
        lBrace: 123,
        grave: 96,
        quot: 34
  }

  var Simbols = {
      rParenthesis: "&rpar;",
      rBracket: "&rbrack;",
      rBrace: "&rbrace;",
      grave: "&grave;",
      quot: "&quot;"
  }

  editor.on('keydown', function (event) {
    key = event.which

    switch (key) {
      case keys.ENTER:
        if (line < 1) {
          editor.removeClass('modo-espera')
          editor.html('')
          modoEscritura = true
          addLine()
        } else {
          wconverter.decode(lineElement)
          addLine()
        } 
        break;
      case keys.BACKSPACE:
        if (lineElement.text() === '' && line > 1) {
          removeLine()
        } 
        else if (line == 1 && lineElement.text() === '') {
          resetEditor()
        }
        break;
      case keys.TAB:
        event.preventDefault()
        lineElement.prepend("&nbsp;&nbsp;&nbsp;&nbsp;")
        break
    }
  })

  editor.on("keypress",function(){
    key = event.which

    switch (key) {
      case keys.lParenthesis:
        lineElement.append(Simbols.rParenthesis)
        break;
      case keys.lBracket:
        lineElement.append(Simbols.rBracket)
        break;
      case keys.lBrace:
        lineElement.append(Simbols.rBrace)
        break;
      case keys.grave:
        lineElement.append(Simbols.grave)
        break;
      case keys.quot:
        lineElement.append(Simbols.quot)
        break;
      default:
        
        break;
      }
  })

  function addLine () {
    lineElement = $('<div></div>').addClass('linea line-' + line)
    lineElement.attr('contenteditable', 'true')

    if (line > 0 || !modoEscritura) {
      oldLine = $('.linea:focus')
      oldLine.removeAttr('contenteditable')
      oldLine.after(lineElement)
    } else {
      editor.append(lineElement)
    }

    lineElement.html('')
    setTimeout(() => { lineElement.html(''), 1 })
    lineElement.focus()
    line++
    updateLines()
    saveNote()
  }

  function removeLine () {
    oldLine = lineElement.prev();
    lineElement.remove()
    lineElement = oldLine
    lineElement.attr("contenteditable","true")
    wconverter.encode(lineElement)
    lib.focusElement(lineElement) 
    line--
    updateLines()
    saveNote()
  }

}

//  buttons functions / funciones de los botones

$('#btn-save-note').on('click', saveNote)

btnTrash.on('click', function () {
  if (modoEscritura) {
    resetEditor()
  }
})

btnMinimaze.on('click', function () {
  ipcRenderer.send('note-min')
})

btnMaximaze.on('click', function () {
  ipcRenderer.send('note-max')
})

btnClose.on('click', function () {
  ipcRenderer.send('note-close')
})

btnPreferences.on('click', function () {
  togglePReferences()
})

btnMenu.on('click', function () {
  toggleMenu()
})

$("#btn-devtools").on("click",function(){
  ipcRenderer.send("devtools")
})


$("#btn-pdf").on("click",function(){
  ipcRenderer.send("reload")
})

searchbar.on('change',function(){
  console.log('Estoy buscando');  
  var text = searchbar.val()
  DB.search(text)
  searchbar.css({border: "2px solid 333"})
  searchbar.animate({border: "1px solid #666"},1000)
})


// ====  Editor states ====

function resetEditor() {
  let views = require("./views.js")
  editor.removeAttr("contenteditable")
  editor.addClass("modo-espera")
  editor.html(views.welcomeScreen())
  editor.focus()
  docTitle.text("New Note")
  modoEscritura = false
  line = 0
}

function togglePReferences () {
  if (!is_preferences) {
    preferences.animate({right: '0'}, 500, function () {
      preferences.addClass('show')
      is_preferences = true
    })
  } else {
    preferences.animate({right: '-300px'}, 500, function () {
      preferences.removeClass('show')
      is_preferences = false
    })
  }
}

function toggleMenu () {
  if (!is_menu) {
    DB.getNotes(recognizeItems)   
    btnMenu.css({background:"#333",color:"#f1f1f1"});
    btnMenu.html("&#10132;");
    btnMenu.css({transform:"rotate(90deg)"});

    noteListBox.animate({top: '50px'}, 500, function () {
      noteListBox.addClass('show-list')
      $(".editor-tools").css({visibility:"hidden"})
      is_menu = true     
    })
  } else {
      btnMenu.css({background:"#f1f1f1",color:"#333"});
      btnMenu.html("&#9776;");
      btnMenu.css({transform:"rotate(0deg)"});
    
    
    noteListBox.animate({top: '610px'}, 500, function () {
      noteListBox.removeClass('show-list')
      $(".editor-tools").css({visibility:"visible"})
      is_menu = false
    })
  }
}

//==== other functions ====

/**
 *  get the new created lines to give them an onclick functionality
 */
function updateLines(){
    var editorLines = $(".linea")

    editorLines.on('click',function(){
      var $this = $(this)
      $this.attr("contenteditable","true")
      lineElement = $this
      wconverter.encode(lineElement)
      lib.focusElement(lineElement)
    })

    editorLines.on('blur',function(e){
      e.stopImmediatePropagation()
      var $this = $(this)
      $this.attr("contenteditable","false")
      wconverter.decode(lineElement)
      
    })
}
/**
 * get the data of the current note and send it to a db.saveNote() to storage in a file
 * @return {void}
 */  

function saveNote () {

  var noteTitle = docTitle.text(),
      body = editor.html(),
      tagsDoc = editor.find(".tag"),
      preview = editor.text().replace(noteTitle, ""),
      tagsToSave = "",
      date = lib.getSqlDateNow(),
      data

  tagsDoc.each(function (i, tag) {
    tagsToSave += tag.textContent
  }, this)

  data = {
      title: noteTitle,
      body: body,
      tags: tagsToSave,
      preview: preview,
      date: date,
      lines: line
  }

    DB.saveNote(data)

}


function deleteNote(noteName) {    
  ipcRenderer.send('delete-item');
  ipcRenderer.on('delete-item-response',function(event,index){
    if(index == 0){
      DB.deleteNote(noteName); 
    }
  });

}
/**
 *  get the note-items elements in order to give them an onclick functionality
 */

function recognizeItems(){
  var noteItem = $(".note-item"),
      btnErase = $(".erase")


  noteItem.on('click',function(){
    var $this = $(this),
        ntitle = $this.find(".title").text(),
        nbody = $this.find(".body").html(),
        nlines = $this.find(".lines").text()

    docTitle.text(ntitle) 
    editor.html(nbody) 
    line = parseInt(nlines)
    lib.externalLinks();
    modoEscritura = true
    updateLines();
    
  })

  btnErase.on('click',function(){
    var noteName = $(this).attr("data-title")
    deleteNote(noteName)
    DB.getNotes(recognizeItems)
  })

}
