const wconverter = require("./wconverter.js");

getTyping($("#writeableDiv"));

function getTyping(writeableDiv){
      var line = 0;
      var temp;
      var key;
      var range = document.createRange();
      var lineElement;
      var WDOldLine;
      var listaNumber;
      var modoEscritura = false;
      var widthTable;
      var btnTrash = $("#btn-trash");
      

    writeableDiv.on('keydown', function(event){
      key = event.which;

      if(key == 13){
         writeableDiv.removeAttr("contenteditable");
        if(line < 1){
            writeableDiv.removeClass("modo-espera");
            writeableDiv.html("");
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
          writeableDiv.removeAttr("contenteditable");
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
        writeableDiv.append(lineElement);
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
        writeableDiv.attr("contenteditable","true");
        var index = line - 1;
        WDOldLine = writeableDiv.children(".line-" + index);
        lineElement = WDOldLine;
        lineElement.attr("contenteditable","true");
        lineElement.focus();
        // main.getImageFromTo(lineElement);
      }


       btnTrash.on('click',function(){
         console.log(" basura")
          if(modoEscritura){
              resetDiv();
          }
        });

        function resetDiv(){
          writeableDiv.removeAttr("contenteditable");
          writeableDiv.addClass("modo-espera");
          writeableDiv.html("<h3>Presione enter para escribir</h3>");
          writeableDiv.focus();
          modoEscritura = false;
          line = 0
        }

        function showLineNumber(){
          let lineNumber = line + 1;
          main.log("lines: " + lineNumber);
        }
  }

 