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
var sc = 1;

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
var f1 = false;
var f2 = false;
var xx = 1;
var yy = 1;
c.addEventListener("wheel", function(event) {
	if (curStyle == "Increase" && (event.wheelDelta == 120 || event.wheelDelta == -3)) {
		if (f2) {
			sc = 1;
		}
		if (xx != pos.x || yy != pos.y) { 
			sc = 1;
			xx = pos.x;
			yy = pos.y;
			bottom_ctx.clearRect( 0, 0, bottomCanvas.width, bottomCanvas.height );
			allundo();
		}
		else if (sc < 3){
			f1 = true;
			f2 = false;
			sc += 0.1;
			bottom_ctx.clearRect( 0, 0, bottomCanvas.width, bottomCanvas.height );
			bottom_ctx.translate(-(pos.x*(sc.toFixed(1)-1)).toFixed(0), -(pos.y*(sc.toFixed(1)-1)).toFixed(0));
			bottom_ctx.scale(sc.toFixed(1),sc.toFixed(1));
			allundo();
			bottom_ctx.scale(1/sc.toFixed(1),1/sc.toFixed(1));
			bottom_ctx.translate((pos.x*(sc.toFixed(1)-1)).toFixed(0), (pos.y*(sc.toFixed(1)-1)).toFixed(0));
		}
	}
	else {
		if (curStyle == "Decrease" && (event.wheelDelta == -120 || event.wheelDelta == 3)) {
		if (f1) {
			sc = 1;
		}
		if (xx != pos.x || yy != pos.y) { 
			sc = 1;
			xx = pos.x;
			yy = pos.y;
			bottom_ctx.clearRect( 0, 0, bottomCanvas.width, bottomCanvas.height );
			allundo();
		}
		else if (sc > 0.2) {
			f2 = true;
			f1 = false;
			sc -= 0.1;
			bottom_ctx.clearRect( 0, 0, bottomCanvas.width, bottomCanvas.height );
			bottom_ctx.translate(pos.x*(1 - sc.toFixed(1)).toFixed(1), pos.y*(1 - sc.toFixed(1)).toFixed(1));
			bottom_ctx.scale(sc.toFixed(1),sc.toFixed(1));
			allundo();
			bottom_ctx.scale(1/sc.toFixed(1),1/sc.toFixed(1));
			bottom_ctx.translate(-pos.x*(1 - sc.toFixed(1)).toFixed(1), -pos.y*(1 - sc.toFixed(1)).toFixed(1));
		}
	}
	}
});