exports.getSqlDateNow =function(){
    var date = new Date();
    var d,m,y = date.getFullYear();
    m = date.getMonth() + 1;
    date = date.toString();
    d = date.slice(8,10);
    date = y + "-" + m + "-" + d;

    return date;
}