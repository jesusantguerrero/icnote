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
 var noteTitle = prepareToSave(title);


    storage.set(noteTitle, data,(err)=>{
      if(err) main.log("ha ocurrido un error");
      main.log("guardado con exito");
    });

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

function prepareToSave(sentence){
  var sentence = sentence.split(" ");
  var result = "";

  sentence.forEach(function(word) {
      result += word + "-";
    
  }, this);

  return result;

}


}