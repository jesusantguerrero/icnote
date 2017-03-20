var hour,min,ampm,weekday,day,month,year;
var h,m,s,ap,wd,d,mth,y;
var months = ["Enero", "Febrero", "Marzo", "abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
var days = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];


hour = $(".hour");
min = $(".min");
ampm= $("ampm");
weekday = $(".weekday");
day = $(".day");
month = $(".month");
year = $(".year");

setInterval(getDateTime,1000);

function getDateTime(){
var date = new Date();
var fecha = date.toString();
h = date.getHours();
wd  = date.getDay();
d = fecha.slice(8,10);
mth = date.getMonth();
y = date.getFullYear();

var hours = fecha.slice(16, 21);


wd= days[wd];
this.month = months[mth];
day.text(d);
weekday.text(wd);

hour.text(hours);
min.text(m);
ampm.text(s);
}
