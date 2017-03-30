
  /**
   * the constructor of a notification class which show the messages to the users through the bar
   * @param {HTMLElement} notificationBar 
   */

exports.notification = function(notificationBar){

    types = {
      error : 'rgb(255, 20, 20)',
      success: 'rgb(9, 240, 12)',
      about: 'rgb(46, 52, 54)',
      info: 'dodgerblue',
      smooth: '#fff'
    };

    _notificationBar  = notificationBar; 
    _messageBox = notificationBar.find(".message-box")
  

  /**
   * display the notificationBar with color and a message
   * @param {string} message 
   * @param {string} type error | sucsess | about | info | smooth
   */

  this.show = function (message,type){
    _messageBox.text(message);
    _notificationBar.css({background: types[type]});
    _notificationBar.animate({opacity:"1",width: "100%"},500,this.hide());
  }

  /**
  * you know 
  */

  this.hide = function(){
    setTimeout(function() {
      _notificationBar.animate({opacity:"0",width: "0"},500);
    },2000);
    
  }
} 
