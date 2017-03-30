
const wconverter = require('./wconverter.js')
lib = require('./mylib.js')

// the DOM Elements
var editor = $('#editor')
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

function getTyping () {
      //  all the functionalities ,convertions and functions called when typing on the editor
      // todas las funcionalidades que ocurren al escribir en el editor

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

  function updateLines(){
    var editorLines = $(".linea")

    editorLines.on('click',function(){
      $(this).attr("contenteditable","true")
    })

    editorLines.on('blur',function(){
      $(this).attr("contenteditable","false")
    })
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

//  editor states
function resetEditor () {
  editor.removeAttr('contenteditable')
  editor.addClass('modo-espera')
  editor.html('<h3>Presione enter para escribir</h3>')
  editor.focus()
  $('#doc-title').text("New Note")
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
    })
  } else {
    noteListBox.animate({left: '-310px'}, 500, function () {
      noteListBox.removeClass('show-list')
      is_menu = false
    })
  }
}

// TODO: eliminar esto cuando termine el periodo de prueba
function showLineNumber () {
  var lineNumber = line + 1
}

function saveNote () {
  var noteTitle = $('#doc-title').text(),
    body = editor.html(),
    tagsDoc = editor.find('.tag'),
    preview = editor.text().replace(noteTitle, ''),
    tagsToSave = ''

  tagsDoc.each(function (i, tag) {
    tagsToSave += tag.textContent
  }, this)

  if (noteTitle != '') {
    DB.saveNote(noteTitle, body, tagsToSave, preview)
  } else {
 
  }
}
