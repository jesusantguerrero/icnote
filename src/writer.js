import notifications from './notifications.js'
import myDB from './myDB.js'
import wconverter from './wconverter.js'
import views from './views.js'
import controllerAbout from './aboutController'
import todographic from './todographic'
const notification = new notifications()
const DB = new myDB(notification)


// the DOM Elements

const editorDom = {
  $editor: $('#editor'),
  $docTitle: $('#doc-title'),
  $preferences: $('#editor-preferences'),
  $graphicView: $('#editor-graphic-view'),
  $noteListBox: $('.notes-list-box'),
  $btnMenu: $('#btn-menu'),
  $btnTrash: $('#btn-trash'),
  $btnGraphic: $('#btn-graphic'),
  $btnSave: $('#btn-save-note'),
  $btnPreferences: $('#btn-preferences'),
  $btnMaximaze: $('#btn-maximaze'),
  $btnMinimaze: $('#btn-minimaze'),
  $btnClose: $('#btn-close'),
  $btnDevTools: $("#btn-devtools"),
  $btnReload: $("#btn-reload"),
  $btnReadMode: $("#btn-read-mode"),
  $btnCallAbout: $(".call-about"),
  $searchbar: $(".searchbar"),
}

export default class Editor {

  constructor() {
    this.line = 0
    this.lineElement = null
    this.oldLine = null
    this.modoEscritura = false
    this.is_preferences = false
    this.is_menu = false
    this.is_graphics = false
    this.is_readMode = false
    this.myGraphic = null
    this.dom = editorDom

    this.typingListener()
    editorEvents(this)
    lib.allowDrop()
  }

  typingListener() {
    const _self = this

    const keys = {
      ENTER: 13,
      BACKSPACE: 8,
      TAB: 9,
      lParenthesis: 40,
      lBracket: 91,
      lBrace: 123,
      grave: 96,
      quot: 34,
      upRow: 38,
      downRow: 40
    }

    const Simbols = {
      rParenthesis: "&rpar;",
      rBracket: "&rbrack;",
      rBrace: "&rbrace;",
      grave: "&grave;",
      quot: "&quot;"
    }

    this.dom.$editor.on('keydown', function (event) {
      const key = event.which

      switch (key) {
        case keys.ENTER:
          if (_self.line < 1) {
            _self.dom.$editor.removeClass('modo-espera')
            _self.dom.$editor.html('')
            _self.modoEscritura = true
            _self.addLine()
            console.log('here')
            console.log(_self.line)
          } else {
            console.log('here in else')
            wconverter.decode(_self.lineElement, false)
            _self.addLine()
          }
          break
        case keys.BACKSPACE:
          if (_self.lineElement.text() === '' && _self.line > 1) {
            _self.removeLine()
          } else if (_self.line == 1 && _self.lineElement.text() === '') {
            _self.resetEditor()
          }
          break
        case keys.TAB:
          event.preventDefault()
          _self.lineElement.prepend("&nbsp &nbsp &nbsp &nbsp ")
          break
        case keys.upRow:
          _self.previousLine()
          break
        case keys.downRow:
          _self.nextLine()
          break
      }
    })

    this.dom.$editor.on("keypress", function () {
      const key = event.which

      switch (key) {
        case keys.lBracket:
          _self.lineElement.append(Simbols.rBracket)
          break
          // case keys.lBrace:
          //   lineElement.append(Simbols.rBrace)
          //   break 
          // case keys.grave:
          //   lineElement.append(Simbols.grave)
          //   break 
          // case keys.quot:
          //   lineElement.append(Simbols.quot)
          //   break 
      }
    })
  }

  /********************************************************
   *             Editor Write mode functions                            
   *                                                       *
   ********************************************************/

  addLine() {
    const _self = this
    this.lineElement = $('<div></div>').addClass('linea line-' + this.line)
    this.lineElement.attr('contenteditable', 'true')

    if (this.line > 0 || !this.modoEscritura) {
      this.oldLine = $('.linea:focus')
      this.oldLine.removeAttr('contenteditable')
      this.oldLine.after(this.lineElement)
    } else {
      this.dom.$editor.append(this.lineElement)
    }

    this.lineElement.html('')
    setTimeout(() => {
      _self.lineElement.html(''), 1
    })
    this.line++
      this.endTyping()
  }

  removeLine() {
    this.oldLine = this.lineElement.prev('.linea')
    this.lineElement.remove()
    this.lineElement = this.oldLine
    this.lineElement.attr("contenteditable", "true")
    wconverter.encode(this.lineElement)
    this.line--
      this.endTyping()
  }

  previousLine() {
    if (this.lineElement.prev().hasClass('linea')) {
      wconverter.decode(this.lineElement, true)
      this.lineElement = this.lineElement.prev('.linea')
      this.lineElement.attr("contenteditable", "true")
      wconverter.encode(this.lineElement)
      this.endTyping()
    }
  }

  nextLine() {
    if (this.lineElement.next().hasClass('linea')) {
      wconverter.decode(this.lineElement, true)
      this.lineElement = this.lineElement.next('.linea')
      this.lineElement.attr("contenteditable", "true")
      wconverter.encode(this.lineElement)
      this.endTyping()
    }
  }

  endTyping() {
    lib.focusElement(this.lineElement)
    lib.getImageFromTo(this.lineElement)
    this.updateLines()
    this.saveNote()
  }

  /********************************************************
   *                    Editor States                            
   *                                                       *
   ********************************************************/

  resetEditor() {
    this.dom.$editor.removeAttr("contenteditable")
    this.dom.$editor.addClass("modo-espera")
    this.dom.$editor.html(views.welcomeScreen())
    this.dom.$editor.focus()
    this.dom.$docTitle.text("New Note")
    this.modoEscritura = false
    this.line = 0
    this.readModeOff()
    this.hideTodoGraphic()
  }

  togglePreferences() {
    const _self = this
    if (!this.is_preferences) {
      this.dom.$preferences.animate({
        right: '0'
      }, 500, function () {
        _self.dom.$preferences.addClass('show')
        _self.hideTodoGraphic()
        _self.is_preferences = true
      })
    } else {
      this.dom.$preferences.animate({
        right: '-300px'
      }, 500, function () {
        _self.dom.$preferences.removeClass('show')
        _self.is_preferences = false
      })
    }
  }

  toggleGraphic() {
    if (!this.is_graphics) {
      if (!this.is_readMode) return false
      this.showTodoGraphic()
    } else {
      this.hideTodoGraphic()
    }
  }

  toggleMenu() {
    const _self = this
    if (!_self.is_menu) {
      _self.getNotes()
      _self.dom.$btnMenu.css({
        background: "#333",
        color: "#f1f1f1"
      })

      _self.dom.$btnMenu.html("&#10132 ")

      _self.dom.$btnMenu.css({
        transform: "rotate(90deg)"
      })

      _self.dom.$noteListBox.animate({
        top: '50px'
      }, 500, function () {
        _self.dom.$noteListBox.addClass('show-list')
        $(".editor-tools").css({
          visibility: "hidden"
        })
        _self.is_menu = true
      })

    } else {
      _self.dom.$btnMenu.css({
        background: "#f1f1f1",
        color: "#333"
      })
      _self.dom.$btnMenu.html("&#9776 ")
      _self.dom.$btnMenu.css({
        transform: "rotate(0deg)"
      })


      _self.dom.$noteListBox.animate({
        top: '610px'
      }, 500, function () {
        _self.dom.$noteListBox.removeClass('show-list')
        $(".editor-tools").css({
          visibility: "visible"
        })
        _self.is_menu = false
      })
    }
  }

  toggleReadMode() {
    if (!this.is_readMode) {
      this.readModeOn()
    } else {
      this.readModeOff()

    }
  }

  readModeOn() {
    this.dom.$editor.addClass("read-mode")
    $("#btn-read-mode").addClass("activated")
    $(".linea").attr("contenteditable", "false")
    $(".linea").off("click")
    this.is_readMode = true

  }

  readModeOff() {
    this.dom.$editor.removeClass("read-mode")
    $("#btn-read-mode").removeClass("activated")
    this.updateLines()
    this.is_readMode = false
  }

  showTodoGraphic() {
    const _self = this
    this.is_preferences = true
    this.togglePreferences()
    this.dom.$graphicView.animate({
      right: '0'
    }, 500, function () {
      _self.dom.$graphicView.addClass('show')
      _self.is_graphics = true
      _self.buildTodoGraphic()

    })
  }

  hideTodoGraphic() {
    const _self = this
    this.dom.$graphicView.animate({
      right: '-300px'
    }, 500, function () {
      _self.dom.$graphicView.removeClass('show')
      _self.is_graphics = false
    })
  }

  buildTodoGraphic() {
    const tasks = this.getTasks()
    this.myGraphic = new todographic($("#graphic-view"), [tasks.done, tasks.todo], ["Done", "Todo"], tasks)
  }

  updateTodoGraphic() {
    const tasks = this.getTasks()
    this.myGraphic.update([tasks.done,tasks.todo], tasks)
  }

  /********************************************************
   *                  Editor utilities                            
   *                                                       *
   ********************************************************/


  updateLines() {
    const editorLines = $(".linea")
    const _self = this

    editorLines.on('click', function (e) {
      e.stopImmediatePropagation()
      const $this = $(this)
      _self.lineElement = $this

      if ($this.attr("contenteditable") === "false") {
        wconverter.encode(_self.lineElement)
      }
    })

    editorLines.on('blur', function (e) {
      e.stopImmediatePropagation()
      const $this = $(this)
      $this.attr("contenteditable", "false")
      wconverter.decode(_self.lineElement)

    })

    $(":checkbox").on('click', function () {
      const $this = $(this)
      const state = $this.attr("checked")
      if (state) {
        $this.removeAttr("checked")
      } else {
        $this.attr("checked", "checked")
      }
      _self.updateTodoGraphic()
      _self.saveNote()
    })

  }

  recognizeItems() {
    const _self = this
      const btnEdit = $(".action.edit-note")
    const btnRead = $(".action.read-note")
    const btnErase = $(".erase")
    console.log(_self);

    btnEdit.on('click', function () {
      _self.noteToEditor($(this)) 
      _self.readModeOff()
    })

    btnRead.on('click', function () {
      _self.noteToEditor($(this))
      _self.readModeOn()
    })

    btnErase.on('click', function () {
      const noteName = $(this).attr("data-title")
      _self.deleteNote(noteName)
    })
  }

  noteToEditor(caller, callback) {
    const _self = this
    let noteItem = caller.parents(".note-item")
    let ntitle = noteItem.find(".o-title").text()
    let nbody = noteItem.find(".body").html()
    let nlines = noteItem.find(".lines").text()

    _self.dom.$docTitle.text(ntitle)
    _self.dom.$editor.html(nbody)
    _self.dom.$editor.removeClass('modo-espera')
    _self.line = parseInt(nlines)
    lib.externalLinks()
    _self.modoEscritura = true

    _self.updateLines()
    _self.toggleMenu()
    _self.buildTodoGraphic()
  }

  getTasks() {
    let checkboxes = this.dom.$editor.find(":checkbox")
    let total = checkboxes.length
    let checked = this.dom.$editor.find(":checkbox[checked]").length
    let average = checked / total * 100

    return {
      total: checkboxes.length,
      done: checked,
      todo: total - checked,
      avg: average.toPrecision(3) + '%'
    }
  }

  /********************************************************
   *                    Editor CRUD                            
   *                                                       *
   ********************************************************/

  saveNote() {
    const dom = this.dom
    let noteTitle = dom.$docTitle.text()
    let body = dom.$editor.html()
    let tagsDoc = dom.$editor.find(".tag")
    let preview = dom.$editor.text().replace(noteTitle, "")
    let tagsToSave = ""
    let date = lib.getSqlDateNow()
    let data
    let type = "Note"

    tagsDoc.each(function (i, tag) {
      tagsToSave += tag.textContent
    }, this)

    if (dom.$editor.find(':checkbox').length > 0) {
      type = "TODO"
    }

    data = {
      title: noteTitle,
      body: body,
      tags: tagsToSave,
      preview: preview,
      date: date,
      type: type,
      lines: this.line
    }

    if (noteTitle.trim() != "New Note") {
      DB.saveNote(data)
    }
  }

  deleteNote(noteName) {
    ipcRenderer.send('delete-item')
    ipcRenderer.on('delete-item-response', function (event, index) {
      if (index == 0) 
        DB.deleteNote(noteName)
        Editor.getNotes()
    })
  }

  getNotes(){
    const _self = this
    const promise = DB.getNotes()
    promise.then( (status) => {
      _self.recognizeItems()
    })
  }

}




function editorEvents(editor) {
  const dom = editor.dom

  dom.$btnSave.on('click', editor.saveNote)

  dom.$btnTrash.on('click', function () {
    if (editor.modoEscritura) {
      editor.resetEditor()
    }
  })

  dom.$btnMinimaze.on('click', function () {
    ipcRenderer.send('note-min')
  })

  dom.$btnMaximaze.on('click', function () {
    ipcRenderer.send('note-max')
  })

  dom.$btnClose.on('click', function () {
    ipcRenderer.send('note-close')
  })

  dom.$btnPreferences.on('click', function () {
    editor.togglePreferences()
  })

  dom.$btnGraphic.on('click', function () {
    editor.toggleGraphic()
  })

  dom.$btnMenu.on('click', function () {
    editor.toggleMenu()
  })

  dom.$btnDevTools.on("click", function () {
    ipcRenderer.send("devtools")
  })

  dom.$btnReload.on("click", function () {
    ipcRenderer.send("reload")
  })

  dom.$btnReadMode.on("click", function () {
    editor.toggleReadMode()
  })

  dom.$searchbar.on('change', function () {
    let text = searchbar.val()
    DB.search(text)
    searchbar.css({
      border: "2px solid 333"
    })

    searchbar.animate({
      border: "1px solid #666"
    }, 500)

  })


  dom.$btnCallAbout.on("click", function () {
    const aboutScreen = views.aboutScreen()
    $(".content-fluid").append(aboutScreen)
    aboutScreen.animate({
      opacity: 1
    }, 200, function () {
      $(".editor-tools").css({
        visibility: "hidden"
      })
      controllerAbout.open(views)
      editor.togglePreferences()
    })


  })
}