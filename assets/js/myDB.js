// my storage method using electron-json-storage
 
exports.DB = class DB {
  constructor(){
    this.storage = require('electron-json-storage')
    this.storage.setDirectory("notes")
  }
      

 saveNote(title, body, tags, preview){
 var data = {"title": title, "body": body, "tags" : tags, "preview": preview};
 var noteTitle = title.trim().split(" ").join("-");


    this.storage.set(noteTitle, data,(err)=>{
      if(err) notification.show("Ha ocurrido un error","error");
      notification.show("Nota guardada con exito","success");
    });

}

updateNote() {
  // TODO: update  stuff here
}

deleteNote(name){
  // TODO: delete note stuff
}

getNotes(){
  this.storage.getAll((err,data)=>{
        if(err) main.log("ha ocurrido un error 11:searcher");
        this.makeItems(data);
      });
}

search(name){
  // TODO: search notes stuff
}

makeItems(data){
  var items = "";
  
  for(var key in data){
    items += "<div class='note-item'>";
    items += "<h3 class='title'>" + data[key]["title"] + "</h3>";
    items += "<p class='preview'>" + data[key]["preview"] + "</p>";
    items += "<p class='tags'>" + data[key]["tags"] + "</p>";
    items += "<div class='body'>" + data[key]["body"] + "</div>";
    items += "</div>";
  }

  $(".notes-list").html(items);
}


}