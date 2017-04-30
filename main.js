const electron = require('electron')
const cp = require('child_process')
const {app, BrowserWindow ,ipcMain,dialog} = electron

let winNewNote


// inicio de la app

app.on('ready', () => {
  newNote()

  // notes
  function newNote () {

    let winNewNote = new BrowserWindow({
      width: 900,
      height: 600,
      show: false,
      transparent: true,
      frame: false
    })
    
    winNewNote.loadURL(`file://${__dirname}/ui/newnote.html`)
    winNewNote.on('ready-to-show', () => {
      winNewNote.show()
    })

    ipcMain.on('note-close', () => {
        winNewNote.close()
    })

    ipcMain.on('note-min', () => {
      winNewNote.minimize()
    })

    ipcMain.on('devtools', ()=>{
      winNewNote.webContents.toggleDevTools()
    })

    ipcMain.on('reload', ()=>{
      winNewNote.webContents.reload()
    })

  }

})
  
// para visualizar los logs por consola desde el renderer

exports.log = function (word) {
  console.log(word)

}

ipcMain.on('delete-item', (event)=>{ 

   let options = {
    type: "info",
    title: "Delete?",
    message: "Are you sure that you want to delete this item?",
    buttons: ["Yes","No"]
  }

  dialog.showMessageBox(options, (index)=>{
    event.sender.send("delete-item-response",index);
  });

});