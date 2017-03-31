const {remote, ipcRenderer} = require('electron')
const main = remote.require("./main.js")
const notifications = require('./notifications.js')
const notification = new notifications.notification($("#notification-bar"))
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

  editor.on('keydown', function (event) {
    key = event.which

    if (key == 13) {
      if (line < 1) {
        editor.removeClass('modo-espera')
        editor.html('')
        modoEscritura = true
        addLine()
      } else {
        wconverter.decode(lineElement)
        addLine()
      }
    }

    if (key == 8) {
      if (lineElement.text() === '' && line > 1) {
        removeLine()
      } else if (line == 1 && lineElement.text() === '') {
        resetEditor()
      }
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
  }

  function removeLine () {
    oldLine = lineElement.prev();
    lineElement.remove()
    lineElement = oldLine
    lineElement.attr("contenteditable","true")
    lib.focusElement(lineElement)
    line--
    updateLines()
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

// ====  Editor states ====

function resetEditor() {
  editor.removeAttr("contenteditable")
  editor.addClass("modo-espera")
  editor.html("<h3>Presione enter para escribir</h3>")
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
    DB.getNotes()
    noteListBox.animate({left: '0'}, 500, function () {
      noteListBox.addClass('show-list')
      is_menu = true
      recognizeItems();
    })
  } else {
    noteListBox.animate({left: '-310px'}, 500, function () {
      noteListBox.removeClass('show-list')
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
    })

    editorLines.on('blur',function(){
      $(this).attr("contenteditable","false")
    })
  }
/**
 * get the data of the current note and send it to a db.saveNote() to storage in a file
 */
function saveNote () {
  var noteTitle = docTitle.text(),
      body = editor.html(),
      tagsDoc = editor.find(".tag"),
      preview = editor.text().replace(noteTitle, ""),
      tagsToSave = "",
      data

  tagsDoc.each(function (i, tag) {
    tagsToSave += tag.textContent
  }, this)

  data = {
      title: noteTitle,
      body: body,
      tags: tagsToSave,
      preview: preview,
      date: "30-mar-2017",
      lines: line
  }

  if (noteTitle != "") {
    DB.saveNote(data,SMOOTHSAVE)
  } else {
 
  }
}

/**
 *  get the note-items elements in order to give them an onclick functionality
 */

function recognizeItems(){
  var noteItem = $(".note-item");


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

}
