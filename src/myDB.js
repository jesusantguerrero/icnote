
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
    this.searchedText = ""
  }

 
/**
 * This method saves the note in a json file
 * @param {{title:string,body:string,tags:string,preview:string,date:string,lines:number}} data 
 * @return {void}
 */    
 
  saveNote(data){
  var noteTitle = data.title,
  noteTitle = noteTitle.trim().split(" ").join("-")


      this.storage.set(noteTitle, data,(err)=>{
        if(err) this.notification.show("Ha ocurrido un error","error")
        this.notification.show("Saved","smooth")
      });

  }

/**
 * This method remove the note
 * @param {string} noteName 
 * @return {void}
 */  

  deleteNote(noteName){
    noteName = noteName.trim().split(" ").join("-")

    this.storage.remove(noteName,(err)=>{
      if(err) this.notification.show("ha ocurrido un error","error")
      this.notification.show("el elemento '"+ noteName + "' ha sido borrado con exito","success")
    })
  }

/**
 * This read all the saved notes and display them in a card ui 
 * @param {function} callback 
 * @return {void}
 */  
  getNotes(callback){
    this.callback = callback
    this.storage.getAll((err,data)=>{
          if(err) main.log("ha ocurrido un error 11")
          this.makeItems(data)
        });
  }

/**
 * Find all that match with the text inserted text
 * @param {string} text 
 * @return {void}
 */ 
  search(text){
    this.searchedText= text.toLowerCase()
    console.log('Estoy en la base de datos y el texto a buscar es: ' + text);
    
    this.storage.getAll((err,data)=>{
          if(err) main.log("ha ocurrido un error 11")
          this.makeSearchedItems(data)
        });

  }

/**
 * it's a Helper who take the data and diplay it in a ui
 * @param {object} data
 * @return {void}
 */ 

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

/**
 * it's a Helper who take the data from a search and diplay it in a ui
 * @param {object} data
 * @return {void}
 */ 
  makeSearchedItems(data){
    var items = "",
    title,date,preview,tags,
    text = this.searchedText

    for(var key in data){
      title = data[key]["title"].toLowerCase()
      date = data[key]["date"].toLowerCase()
      preview = data[key]["preview"].toLowerCase()
      tags = data[key]["tags"].toLowerCase()

      if(title.includes(text) ||date.includes(text) ||preview.includes(text) || tags.includes(text)){
        items += "<div class='note-item'>";
        items += "<h3 class='title'>" + data[key]["title"] + "</h3>"
        items += "<small class='date'>" + data[key]["date"] + "</small>"
        items += "<p class='preview'>" + data[key]["preview"].slice(0,50) + "</p>"
        items += "<p class='tags'> <span clas='icon icon-tag'></span>" + data[key]["tags"] + "</p>"
        items += "<div class='body'>" + data[key]["body"] + "</div>"
        items += "<p class='metadata'><span class='lines'>" + data[key]["lines"] + "</span></span>" 

        items += "<div class='erase' data-title='"+ data[key]["title"]+"'> <span class='icon icon-trash'></span></div>"
        items += "</div>";
      }
           
    }

    $(".notes-list").html(items);
    this.callback();
  }


}