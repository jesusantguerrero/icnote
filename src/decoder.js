//  aqui es donde hacemos a conversion de todos los comandos posibles del buscador / here we convert the command shurtcuts and commands of
// jbar

exports.decode = function(sentence){
      var token = sentence.slice(0,1); 
      var params = sentence.slice(1).split(" ");
      switch(token){
                                                                                                            
              case '$': {
                //  comprobamos si la palabra ingresada es shurtcut de algun comando / here we check if the param is a command shurtcut
                storage.get(params[0],(err,data)=>{
                  if(err) main.log("ha ocurrodo un error en el get");
                    main.command(data.program);
                });
                
                 
              }
              case '!':
                if(params[0] == 'addprogram'){
                  var shortCut = params[1],
                      program  = params[2],
                      description = "";

                      for(var i = 3; i < params.length; i++){
                        description += params[i] + " ";
                      }
                      storage.set(shortCut,{program: program,description: description},(err)=>{
                        if(err) main.log("ha ocurrido un error");
                      });

                }
                break;
              case '>':
                  ipcRenderer.send(params[0]);
                break;
      }
}

