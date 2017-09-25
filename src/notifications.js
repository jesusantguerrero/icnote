const types = {
  error : 'rgb(255, 20, 20)',
  success: 'rgb(9, 240, 12)',
  about: 'rgb(46, 52, 54)',
  info: 'dodgerblue',
  smooth: '#fff'
} 

const texts = {
  error : 'rgb(255, 20, 20)',
  success: '#f8f8f8',
  about: 'rgb(46, 52, 54)',
  info: 'dodgerblue',
  smooth:'rgb(9, 240, 12)'
} 

export default class {

  constructor (){
    this.$notificationBar  = $("#notification-bar")  
    this.$messageBox = this.$notificationBar.find(".message-box")
  }
  
  /**
   * display the notificationBar with color and a message
   * @param {string} message 
   * @param {string} type error | sucsess | about | info | smooth
   */

  show (message,type) {
    this.$messageBox.text(message) 
    this.$notificationBar.css({background: types[type],color: texts[type]}) 
    this.$notificationBar.animate({opacity:"1",width: "100%"},500,this.hide()) 
  }

  hide () {
    const self = this 
    setTimeout(function() {
      self.$notificationBar.animate({opacity:"0",width: "0"},500) 
    },2000) 
    
  }
} 
