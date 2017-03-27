exports.notification = function(notificationBar){
  types = {
    error : 'rgb(255, 20, 20)',
    success: 'rgb(9, 240, 12)',
    about: 'rgb(46, 52, 54)',
    info: 'dodgerblue' 
  };

  _notificationBar  = notificationBar; // jquery nodeElement
  _messageBox = _notificationBar.find(".message-box")// jquery node element

  this.show = function(message,type){
    _messageBox.text(message);
    _notificationBar.css({background: types[type]});
    _notificationBar.animate({opacity:"1",width: "100%"},500,this.hide());
  }


  this.hide = function(){
    setTimeout(function() {
      _notificationBar.animate({opacity:"0",width: "0"},500);
    },2000);
    
  }
}