
/**
 * this class is the persistence method of the app works like a databse
 *  using electron-json-storage
 */

exports.DB = class DB {
  constructor(notification){
    this.storage = require('electron-json-storage')
    this.storage.setDirectory("notes")
    this.notification = notification
    this.callback = function(){}
  }

 
/**
 * This method saves the note in a json file
 * @param {{title:string,body:string,tags:string,preview:string,date:string,lines:number}} data 
 * @param {boolean} notificationType 
 * @return {void}
 */    
 
  saveNote(data, notificationType){
  var noteTitle = data.title,
  noteTitle = noteTitle.trim().split(" ").join("-")


      this.storage.set(noteTitle, data,(err)=>{
        if(err) this.notification.show("Ha ocurrido un error","error")
        this.notification.show("Nota guardada con exito","success")
      });

  }

  deleteNote(noteName){
    noteName = noteName.trim().split(" ").join("-")
    main.log(noteName)

    this.storage.remove(noteName,(err)=>{
      if(err) this.notification.show("ha ocurrido un error","error")
      this.notification.show("el elemento '"+ noteName + "' ha sido borrado con exito","success")
    })
  }


  getNotes(callback){
    this.callback = callback
    this.storage.getAll((err,data)=>{
          if(err) main.log("ha ocurrido un error 11")
          this.makeItems(data)
        });
  }

  search(name){
    // TODO: search notes stuff
  }

  makeItems(data){
    var items = ""

    for(var key in data){
      items += "<div class='note-item'>";
      items += "<h3 class='title'>" + data[key]["title"] + "</h3>"
      items += "<small class='date'>" + data[key]["date"] + "</small>"
      items += "<p class='preview'>" + data[key]["preview"].slice(0,50) + "</p>"
      items += "<p class='tags'>" + data[key]["tags"] + "</p>"
      items += "<div class='body'>" + data[key]["body"] + "</div>"
      items += "<p class='metadata'><span class='lines'>" + data[key]["lines"] + "</span></span>" 

      items += "<div class='erase' data-title='"+ data[key]["title"]+"'> <span class='icon icon-trash'></span></div>"
      items += "</div>";
    }

    $(".notes-list").html(items);
    this.callback();
  }


}