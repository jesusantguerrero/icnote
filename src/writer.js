const notifications = require('./notifications.js')
const notification = new notifications.init()
const myDB = require('./myDB.js')
const DB = new myDB.DB(notification)
const wconverter = require('./wconverter.js')
const views = require('./views.js')
const controllerAbout = require('./aboutController')

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
var is_readMode = false


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
  //     case keys.lParenthesis:
  //       lineElement.append(Simbols.rParenthesis)
  //       break;
       case keys.lBracket:
         lineElement.append(Simbols.rBracket)
         break;
  //     case keys.lBrace:
  //       lineElement.append(Simbols.rBrace)
  //       break;
  //     case keys.grave:
  //       lineElement.append(Simbols.grave)
  //       break;
  //     case keys.quot:
  //       lineElement.append(Simbols.quot)
  //       break;
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

$("#btn-read-mode").on("click",function(){
  toggleReadMode()
})

searchbar.on('change',function(){ 
  var text = searchbar.val()
  DB.search(text)
  searchbar.css({border: "2px solid 333"})
  searchbar.animate({border: "1px solid #666"},1000)
})


$(".call-about").on("click",function(){
  var aboutScreen = views.aboutScreen()
  $(".content-fluid").append(aboutScreen)
  aboutScreen.animate({opacity:1},200,function(){
    $(".editor-tools").css({visibility:"hidden"})
    controllerAbout.init(views)
    togglePReferences()
  })
  

})

// ====  Editor states ====

function resetEditor() {
  
  editor.removeAttr("contenteditable")
  editor.addClass("modo-espera")
  editor.html(views.welcomeScreen())
  editor.focus()
  docTitle.text("New Note")
  modoEscritura = false
  line = 0
  readModeOff()
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

function toggleReadMode(){
  if(!is_readMode){
    readModeOn()
    
  }else{
    readModeOff()
    
  }
}

function readModeOn(){
  editor.addClass("read-mode")
  $("#btn-read-mode").addClass("activated")
  $(".linea").attr("contenteditable","false") 
  $(".linea").off("click")
  is_readMode = true
}

function readModeOff(){
  editor.removeClass("read-mode")
  $("#btn-read-mode").removeClass("activated")
  updateLines()
  is_readMode = false
}

//==== other functions ====

/**
 *  get the new created lines to give them an onclick functionality
 */
function updateLines(){
    var editorLines = $(".linea")
    editorLines.on('click',function(e){
      e.stopImmediatePropagation()
      var $this = $(this)
      lineElement = $this

      if($this.attr("contenteditable") == "false"){
        wconverter.encode(lineElement)
      }
      var range = lightrange.saveSelection()
      var sel = lightrange.restoreSelection(range)
    })

    editorLines.on('blur',function(e){
      e.stopImmediatePropagation()
      var $this = $(this)
      $this.attr("contenteditable","false")
      wconverter.decode(lineElement)
      
    })

    $(":checkbox").on('click',function(){
      $this = $(this)
      var state = $this.attr("ckecked")
      if(state == "true"){
        $this.removeAttr("checked")
      }else{
        $this.attr("checked","true")
      }
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
      data,
      type ="Note"

  tagsDoc.each(function (i, tag) {
    tagsToSave += tag.textContent
  }, this)

  if(editor.find(':checkbox').length > 0){
    type = "TODO"
  }

  data = {
      title: noteTitle,
      body: body,
      tags: tagsToSave,
      preview: preview,
      date: date,
      type: type,
      lines: line
  }

  if(noteTitle.trim() != "New Note"){
    DB.saveNote(data)
  }
    

}


function deleteNote(noteName) {    
  ipcRenderer.send('delete-item');
  ipcRenderer.on('delete-item-response',function(event,index){
    if(index == 0){
      DB.deleteNote(noteName); 
      DB.getNotes(recognizeItems)
    }
  });

}
/**
 *  get the note-items elements in order to give them an onclick functionality
 */

function recognizeItems(){
  var btnEdit = $(".action.edit-note"),
      btnRead = $(".action.read-note"),
      btnErase = $(".erase")


  btnEdit.on('click',function(){
    noteToEditor($(this),readModeOff)  
  })

  btnRead.on('click',function(){
    noteToEditor($(this),readModeOn)
  })

  function noteToEditor(caller,callback){
    var noteItem  = caller.parents(".note-item"),
        ntitle = noteItem.find(".title").text(),
        nbody  = noteItem.find(".body").html(),
        nlines = noteItem.find(".lines").text()

    docTitle.text(ntitle) 
    editor.html(nbody) 
    editor.removeClass('modo-espera')
    line = parseInt(nlines)
    lib.externalLinks();
    modoEscritura = true
    updateLines();
    toggleMenu()
    callback()
  }

  btnErase.on('click',function(){
    var noteName = $(this).attr("data-title")
    deleteNote(noteName)
  })

}
