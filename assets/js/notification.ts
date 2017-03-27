
import $ = require("jquery");

class notification {
  private _notificationBar : JQuery;
  private _message = this._notificationBar.find("#message")

  /**
   *
   */
  
  constructor(notificationBar: JQuery) {
    this._notificationBar = notificationBar;
  }

  showNotification(message: string, type: string){
    this._message.innerHTML = message;
    this._notificationBar.animate({},500,this.hideBar);
  }


  hideBar(){
    setTimeout(function(name) {
      name.animate({opacity:"0"},500);
    },1000);
    
  }

}