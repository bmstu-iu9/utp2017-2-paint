var c = document.getElementById( "topCanvas" );
var ctx = c.getContext( "2d" );
var bottomCanvas = document.getElementById( "bottomCanvas" );
var bottom_ctx = bottomCanvas.getContext( "2d" );
var t = document.getElementById("ttt");
var s = document.getElementById("size");
var f = document.getElementById("font");
var addt = document.getElementById("addText");
var x = 0;
var y = 0;
flag = false;
var curfont = f.value;
var cursize = s.value;


addt.addEventListener("click", function(event) { 
	c.addEventListener("click", function(event) { 
		x = event.clientX - 125;
		y = event.clientY - 8;
		flag = true;
	});
});

 t.addEventListener("blur", function(event) {
	if (flag) {
		bottom_ctx.font = cursize + "px " + curfont;
		bottom_ctx.fillStyle = localStorage.getItem('savedColor');
		bottom_ctx.fillText(t.value,x,y);
		flag = false;
		allundo();
	}
 });
 
s.addEventListener("change", function () { cursize = s.value});
f.addEventListener("change", function () { curfont = f.value});
