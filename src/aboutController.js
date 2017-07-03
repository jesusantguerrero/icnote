/**
 *  Add functionability to the About Screen View of the app , acting as a controller 
 * @return {void}
 */
    
exports.init = function(){
$(".about-nav button").on('click',function(e){
  var documentName = $(this).text().toLowerCase().replace(" ","")
  views.getDocumentation(documentName)
})



$(".close-about").on('click',function(){
  $(".about-screen").animate({opacity:0,width:0,height:0},600,function(){
    $(".about-screen").remove()
  })
  $(".editor-tools").css({visibility:"visible"})
  
})

}