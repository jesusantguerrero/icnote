exports.myDb = function(){
      storage = require('electron-json-storage'),
      filesPath = "notes/";

var structure ={
        title: "something",
        body : "body",
        tags : "tags",
        preview: "preview"
      }

this.saveNote = function(){
  // TODO:  save notes function
}

this.updateNote = function () {
  // TODO: update  stuff here
}

this.deleteNote = function(name){
  // TODO: delete note stuff
}

this.getNotes = function(){
  // TODO: read all the notes
}

this.search = function(name){
  // TODO: search notes stuff
}


}