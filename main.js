const electron = require('electron')
const cp = require('child_process')
const {app, BrowserWindow ,ipcMain} = electron

var winNewNote


// inicio de la app

app.on('ready', () => {
  newNote()


  // notes
  function newNote () {

    winNewNote = new BrowserWindow({
      width: 900,
      height: 600,
      show: false,
      transparent: true,
      frame: false
    })
    
    winNewNote.loadURL(`file://${__dirname}/ui/newnote.html`)
    winNewNote.on('ready-to-show', () => {
      winNewNote.show()
      winNewNote.webContents.openDevTools();
    })

    ipcMain.on('note-close', () => {
        winNewNote.close()
    })

    ipcMain.on('note-min', () => {
      winNewNote.minimize()
    })

  }

})
  
// para visualizar los logs por consola desde el renderer

exports.log = function (word) {

  console.log(word)

}