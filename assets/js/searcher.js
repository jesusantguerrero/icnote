var $buscador  = $("#buscador"),
    $data = $(".data"),
    $dataTipExpanded = false;

$buscador.on('keydown',function(event){  
  var key = event.which;
  var token = $buscador.val().slice(0,1);

  if(token == "$"){
    if(!$dataTipExpanded){
      storage.getAll((err,data)=>{
        if(err) main.log("ha ocurrido un error 11:searcher");
        makeItems(data);  
        $data.addClass("data-visible");
        $dataTipExpanded = true;
        ipcRenderer.send('data-tip');
      });
     
    }
    }else{
      if($dataTipExpanded){
        $data.removeClass("data-visible");
        $dataTipExpanded = false;
        ipcRenderer.send('data-tip');
      }
      
  }

  if(key == 13){
    if(token == "!" || token == "$" || token == ">"){
      decoder.decode($buscador.val());
    }else{
      // habilitar las busquedas en google
    }

    $buscador.val("");        
  }
  
});


function makeItems(data){
  var items = "";
  for(key in data){
    items += "<p class='data-item'><span class='type'>Application </span>"
    items += "<span class='name'> "+key + "</span>" 
    items += "<span='description'> |" + data[key]["description"] + "</span></p>"; 
  }

  $(".data").html(items);
  searchFunctions()

}

function searchFunctions(){
  var $dataItem  = $(".data-item");
  $(window).innerHeight = 50;

  $dataItem.on('click',function(){
    var $this = $(this);
    var $cmd = $this.find(".name").text().trim();
    $buscador.val("$"+$cmd);
    $buscador.focus();
    $data.removeClass("data-visible");
  });

}