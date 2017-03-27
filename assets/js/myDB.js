exports.DB = function(){
      const storage = require('electron-json-storage');
      storage.setDirectory("notes");

//data interface
//  vdata ={ title: "something",
//           body : "body",
//           tags : "tags",
//           preview: "preview"
//         }

this.saveNote = function(title, body, tags, preview){
 var data = {"title": title, "body": body, "tags" : tags, "preview": preview};
 var noteTitle = title.trim().split(" ").join("-");


    storage.set(noteTitle, data,(err)=>{
      if(err) notification.show("Ha ocurrido un error","error");
      notification.show("Nota guardada con exito","success");
    });

}

this.updateNote = function () {
  // TODO: update  stuff here
}

this.deleteNote = function(name){
  // TODO: delete note stuff
}

this.getNotes = function(){
  storage.getAll((err,data)=>{
        if(err) main.log("ha ocurrido un error 11:searcher");
        makeItems(data);
      });
}

this.search = function(name){
  // TODO: search notes stuff
}

function makeItems(data){
  var items = "";
  
  for(key in data){
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