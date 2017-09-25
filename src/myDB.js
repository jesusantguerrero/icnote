import storage from 'electron-json-storage'
import views  from './views.js'
storage.setDirectory("notes")


export default class {
  
  constructor($notification) {
    this.$notification = $notification
  }

  saveNote(data) {
    let _self = this
    let noteTitle = data.title
    
    noteTitle = noteTitle.trim().split(" ").join("-")
    storage.set(noteTitle, data, (err) => {
      if (err) notification.show("Ha ocurrido un error", "error")
      _self.$notification.show("Saved", "smooth")
    }) 
  }


  deleteNote(noteName) {
    const self = this
    noteName = noteName.trim().split(" ").join("-")

    storage.remove(noteName, (err) => {
      if (err) self.$notification.show("ha ocurrido un error", "error")
      self.$notification.show("el elemento '" + noteName + "' ha sido borrado con exito", "success")
    })
  }

  getNotes() {
    return new Promise((resolve, reject)=> {
      storage.getAll((err, data) => {
        if (err) main.log(err.toString())
          resolve(views.makeItems(data))
      }) 
    })
  }

  search(text) {
    views.setSearchedText(text.toLowerCase())

    storage.getAll((err, data) => {
      if (err) main.log("ha ocurrido un error 11")
      views.makeSearchedItems(data)
    }) 
  }

  getRemoteNotes() {
    // TODO: remote support
  }
}