

const storage = require('electron-json-storage')
const views = require("./views.js")
var callback = function(){}
var searchedText = ""

storage.setDirectory("notes")

/**
 * this class is the persistence method of the app works like a databse
 *  using electron-json-storage
 */

exports.DB = function(notification){  
  _notification = notification

 
/**
 * This method saves the note in a json file
 * @param {{title:string,body:string,tags:string,preview:string,date:string,lines:number}} data 
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
    searchedText= text.toLowerCase()
    console.log('Estoy en la base de datos y el texto a buscar es: ' + text);
    
    storage.getAll((err,data)=>{
      if(err) main.log("ha ocurrido un error 11")
        views.makeSearchedItems(data)
      });
  }


}