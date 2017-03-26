exports.getSqlDateNow =function(){
    var date = new Date();
    var d,m,y = date.getFullYear();
    m = date.getMonth() + 1;
    date = date.toString();
    d = date.slice(8,10);
    date = y + "-" + m + "-" + d;

    return date;
}


exports.getImage = function(token){
    var start = token.search("|");
    var cmd = token.slice(0,1);
    let limite = start - 3;
    var src = token.slice(2,limite);
    var type = token.slice(-1); 
    
    return [cmd,src,type];
}

exports.getLink = function(token){
    var cmd = token.slice(0,2);
    var body = token.slice(3).split(" ");
    var name = " ";
    for(i = 1; i < body.length ;i++){
        name += body[i];
    }
        
    
    return [cmd,body[0],name];
}