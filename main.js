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
      resizable: false,
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
      // winNewNote.minimize()
      let w = 900
      let h = 600
      let c = 10
      let timer = setInterval(()=>{
            if(c != 0){
              w -= 90
              h -= 60
              c--
              winNewNote.setSize(w,h,true)
            }else{
              winNewNote.minimize()
              clearInterval(timer)
            }     
          },3)
    })

    winNewNote.on('restore',()=>{
      winNewNote.setSize(900,600,true)
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