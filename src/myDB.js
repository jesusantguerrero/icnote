

const storage = require('electron-json-storage')
const views = require("./views.js")

storage.setDirectory("notes")

/**
 * this class is the persistence method of the app works like a databse
 *  using electron-json-storage
 */

exports.DB = function(notification){  
  _notification = notification

 
/**
 * This method saves the note in a json file
 * @param {{title:string,body:string,tags:string,preview:string,date:string,type:string,lines:number}} data 
 * @return {void}
 */    
 
  this.saveNote = function(data){
  var noteTitle = data.title,
  noteTitle = noteTitle.trim().split(" ").join("-")


      storage.set(noteTitle, data,(err)=>{
        if(err) notification.show("Ha ocurrido un error","error")
        notification.show("Saved","smooth")
      });

  }

/**
 * This method remove the note
 * @param {string} noteName 
 * @return {void}
 */  

  this.deleteNote = function(noteName){
    noteName = noteName.trim().split(" ").join("-")

    storage.remove(noteName,(err)=>{
      if(err) notification.show("ha ocurrido un error","error")
      notification.show("el elemento '"+ noteName + "' ha sido borrado con exito","success")
    })
  }

/**
 * This read all the saved notes and display them in a card ui 
 * @param {function} callback 
 * @return {void}
 */  
  this.getNotes = function(callback){
    views.setCallback(callback)
    storage.getAll((err,data)=>{
          if(err) main.log("ha ocurrido un error 11")
          views.makeItems(data)
        });
  }

/**
 * Find all that match with the text inserted text
 * @param {string} text 
 * @return {void}
 */ 
  this.search = function(text){
    views.setSearchedText(text.toLowerCase())
    
    storage.getAll((err,data)=>{
      if(err) main.log("ha ocurrido un error 11")
        views.makeSearchedItems(data)
      });
  }

  this.getRemoteNotes = function(){
    $.ajax({
      method: 'get',
      url:'https://icnote.herokuapp.com/api/users',
      success: function(res){ 
        for (var index = 0; index < res.length; index++) {
          var element = res[index];
          console.log(element);
        }
      },
      error: function(){console.log('No hay conexion');
      ;}
    })
  
  }
}