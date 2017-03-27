


const wconverter = require("./wconverter.js");


      

// the DOM Elements
var editor        = $("#editor"),
    preferences   = $(".editor-preferences"),
    btnTrash      = $("#btn-trash"),
    btnPreferences= $("#btn-preferences"),
    btnMaximaze   = $("#btn-maximaze"),
    btnMinimaze   = $("#btn-minimaze"),
    btnClose      = $("#btn-close");

// the context vars 
var line = 0,
    temp,
    key,
    lineElement,
    WDOldLine,
    listNumber,
    modoEscritura = false,
    widthTable,
    is_preferences = false;

getTyping();

function getTyping(){
      //  all the functionalities ,convertions and functions called when typing on the editor
      // todas las funcionalidades que ocurren al escribir en el editor

    editor.on('keydown', function(event){
      key = event.which;

      if(key == 13){
         editor.removeAttr("contenteditable");
        if(line < 1){
            editor.removeClass("modo-espera");
            editor.html("");
            modoEscritura =true;
            addLine();
            line++;
            // principaljs.allowDrop();
        }else{
          addLine();
          line++;
          temp = WDOldLine.text();
          wconverter.decode(WDOldLine,temp);
        }  
      }

      if(key == 8){
        if(lineElement.text() == ""){
          removeLine();
          // editor.removeAttr("contenteditable");
          if(line == 0){
            resetDiv();
            
          }
        }        

      }  
    });

    function addLine(){
        if(line > 0 || !modoEscritura){
          WDOldLine = lineElement;
          WDOldLine.removeAttr("contenteditable");
        }  
        
        lineElement = $("<div></div>").addClass("linea line-"+ line);
        lineElement.attr("contenteditable","true");
        editor.append(lineElement);
        lineElement.html("");
        setTimeout(()=>{ lineElement.html(""),1})
        lineElement.focus();
        // main.getImageFromTo(lineElement);
    }

    function removeLine(){
      if(line > 0){
        line--;
      }
        
      lineElement.remove();
      editor.attr("contenteditable","true");
      var index = line - 1;
      WDOldLine = editor.children(".line-" + index);
      lineElement = WDOldLine;
      lineElement.attr("contenteditable","true");
      // main.getImageFromTo(lineElement);
    }

  }

  //  buttons functions / funciones de los botones

  btnTrash.on('click',function(){
    console.log(" basura")
    if(modoEscritura){
      resetDiv();
    }
  });

  btnMinimaze.on('click',function(){
    ipcRenderer.send('note-min');
  });

  btnMaximaze.on('click',function(){
    ipcRenderer.send('note-max');
  });

  btnClose.on('click',function(){
    ipcRenderer.send('note-close');
  });

  btnPreferences.on('click',function(){
    togglePReferences();
  });
 

//  editor states
 function resetDiv(){
      editor.removeAttr("contenteditable");
      editor.addClass("modo-espera");
      editor.html("<h3>Presione enter para escribir</h3>");
      editor.focus();
      modoEscritura = false;
      line = 0
    }

function togglePReferences(){
  if(!is_preferences){
    preferences.animate({right:"0"},500,function(){
      preferences.addClass("show");
      is_preferences = true;
    });
  }else{
    preferences.animate({right:"-300px"},500,function(){
      preferences.removeClass("show");
      is_preferences = false
    });
  }
}







// TODO: eliminar esto cuando termine el periodo de prueba
    function showLineNumber(){
      let lineNumber = line + 1;
      main.log("lines: " + lineNumber);
    }

    