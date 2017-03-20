var windows = [];
windows["notereader"] = document.querySelector('link[win="notereader"').import.querySelector(".content-fluid");

exports.noteFuntions =  function(context){
  var $loading          =  $(".loading"),
      $btnAddTask       =  $("#btn-add-task"),
      $btnDeleteTask    =  $("#btn-delete-task"),
      $btnCancelTask    =  $("#btn-cancel-task"),
      $btnSaveTask      =  $("#btn-save-task"),
      $btnUpdateTask    =  $("#btn-update-task"),
      $btnReadNote      =  $('#btn-read-note'),
      $rollRow          =  $(".roll-row"),
      $searchBar        =  $("#in-search"),
      $title            =  $("#in-title"),
      $detail           =  $("#in-datail"),
      $asignature       =  $("#in-asignature"),
      $tags             =  $("#in-tags"),
      $date             =  $("#in-date"),
      $color            =  $("#in-color"),
      noteId,
      selected          =  false;
   
  initializeComponents();

// Events main task

  $searchBar.on('keypress',function(){
      DB.searchNotes(searchBar.val());  
  });

  $btnAddTask.click( function(){
    $rollRow.animate({"left":"-100%"},1000);
  });

  $btnDeleteTask.click(function(){
    deleteData(noteId);
  });

  $btnReadNote.on('click',function(){
  let ventana = windows["notereader"];
      context.html(ventana);

  });


  //events in the form of task

  $btnCancelTask.on('click',function(){
    backToMainWindow();
  });

  $btnSaveTask.on('click',function(){
    saveData();
    backToMainWindow();
    initializeComponents();
  });

  $btnUpdateTask.on('click',function(){
    backToMainWindow();   
  });

  function backToMainWindow(){
    $rollRow.animate({"left":"0"},500);
  }


  function selectTask(noteItem){
    $(".note-preview").removeClass("selected-note");
    if(noteItem.children(".note-id").text() != noteId){
        noteItem.addClass("selected-note");
        selected = true;
        $(".on-select").css({"display":"flex"});
    }else{
      if(selected){
        resetState();
      }else{
        noteItem.addClass("selected-note");
        selected = true;
        $(".on-select").css({"display":"flex"});
        
      }
    }
    

  }

  // CRUD functions

    function saveData(){
    DB.saveTask($title.val(),$detail.val(),$asignature.val(),$tags.val(),$date.val(),$color.val());
    alert($detail.val());
    }

    function clearForm(){
    DB.saveTask($title.val(""),$detail.val(""),$asignature.val(""),$tags.val(""),$date.val(""),$color.val(""));
    }

    function deleteData(id){
      
      ipc.send('delete-item');
      ipc.on('delete-item-response',function(event,index){
        if(index == 0){
          DB.deleteNote(id);
          resetState();
          initializeComponents(); 
        }
      });
    }


  // main functions

  function initializeComponents(){
    $rollRow.css({visibility:"hidden"});
    $loading.css({visibility:"visible"});
    DB.getNoteList();
    setTimeout(selectAble,5000); 
  }

  function selectAble(){

      $(".note-preview").on('click',function(){
        let selectedNote = $(this);
        selectTask(selectedNote);
        noteId = selectedNote.children(".note-id").text();
      });  

      $rollRow.css({visibility:"visible"});
      $loading.css({visibility:"hidden"});
       
    }

  function resetState(){
    selected = false;
    noteId = null;
    $(".on-select").css({"display":"none"});
  }

}