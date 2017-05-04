
  /**
   * the constructor of a notification class which show the messages to the users through the bar
   * 
   */

exports.init = function(){

    types = {
      error : 'rgb(255, 20, 20)',
      success: 'rgb(9, 240, 12)',
      about: 'rgb(46, 52, 54)',
      info: 'dodgerblue',
      smooth: '#fff'
    };

    texts = {
      error : 'rgb(255, 20, 20)',
      success: '#f8f8f8',
      about: 'rgb(46, 52, 54)',
      info: 'dodgerblue',
      smooth:'rgb(9, 240, 12)'
    };

    _notificationBar  = $("#notification-bar"); 
    _messageBox = _notificationBar.find(".message-box")
  

  /**
   * display the notificationBar with color and a message
   * @param {string} message 
   * @param {string} type error | sucsess | about | info | smooth
   */

  this.show = function (message,type){
    _messageBox.text(message);
    _notificationBar.css({background: types[type],color: texts[type]});
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
