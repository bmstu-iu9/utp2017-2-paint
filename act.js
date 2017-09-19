"use strict";
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
var flag = false;

addt.addEventListener("click", function(event) { 
	c.addEventListener("click", function(event) { 
		x = pos.x;
		y = pos.y;
		flag = true;
	});
});

 t.addEventListener("blur", function(event) {
	if (flag) {
		curObject = new Text(x, y, t.value, s.value, f.value, localStorage.getItem('savedColor'));
		curPos = curPos > 0 ? curPos : 0;
        objects = objects.slice( 0, curPos );
        objects.push( curObject );
		bottom_ctx.clearRect( 0, 0, bottomCanvas.width, bottomCanvas.height );
		for( let i = 0; i < curPos; i++ ) {
			objects[i].drawBottom();
		}
		curPos = objects.length;
		curObject.drawBottom();
		flag = false;
		curObject = null;
	}
 });
 
var sc = 1;
var f1 = false;
var f2 = false;
var xx = -5000;
var yy = -5000;

c.addEventListener("wheel", function(event) {
	if (curStyle == "Increase" && (event.wheelDelta == 120 || event.wheelDelta == -3)) {
		if (f2) {
			sc = 1;
		}
		if (Math.abs(xx - pos.x) > 3 || Math.abs(yy - pos.y) > 3) { 
			sc = 1;
			xx = pos.x;
			yy = pos.y;
			bottom_ctx.clearRect( 0, 0, bottomCanvas.width, bottomCanvas.height );
			for( let i = 0; i < curPos; i++ ) {
				objects[i].drawBottom();
			}
		}
		else if (sc < 3){
			f1 = true;
			f2 = false;
			sc += 0.1;
			bottom_ctx.clearRect( 0, 0, bottomCanvas.width, bottomCanvas.height );
			bottom_ctx.translate(-(pos.x*(sc.toFixed(1)-1)).toFixed(0), -(pos.y*(sc.toFixed(1)-1)).toFixed(0));
			bottom_ctx.scale(sc.toFixed(1),sc.toFixed(1));
			for( let i = 0; i < curPos; i++ ) {
				objects[i].drawBottom();
			}
			bottom_ctx.scale(1/sc.toFixed(1),1/sc.toFixed(1));
			bottom_ctx.translate((pos.x*(sc.toFixed(1)-1)).toFixed(0), (pos.y*(sc.toFixed(1)-1)).toFixed(0));
		}
	}
	else {
		if (curStyle == "Decrease" && (event.wheelDelta == -120 || event.wheelDelta == 3)) {
		if (f1) {
			sc = 1;
		}
		if (Math.abs(xx - pos.x) > 3 || Math.abs(yy - pos.y) > 3) { 
			sc = 1;
			xx = pos.x;
			yy = pos.y;
			bottom_ctx.clearRect( 0, 0, bottomCanvas.width, bottomCanvas.height );
			for( let i = 0; i < curPos; i++ ) {
				objects[i].drawBottom();
			}
		}
		else if (sc > 0.2) {
			f2 = true;
			f1 = false;
			sc -= 0.1;
			bottom_ctx.clearRect( 0, 0, bottomCanvas.width, bottomCanvas.height );
			bottom_ctx.translate(pos.x*(1 - sc.toFixed(1)).toFixed(1), pos.y*(1 - sc.toFixed(1)).toFixed(1));
			bottom_ctx.scale(sc.toFixed(1),sc.toFixed(1));
			for( let i = 0; i < curPos; i++ ) {
				objects[i].drawBottom();
			}
			bottom_ctx.scale(1/sc.toFixed(1),1/sc.toFixed(1));
			bottom_ctx.translate(-pos.x*(1 - sc.toFixed(1)).toFixed(1), -pos.y*(1 - sc.toFixed(1)).toFixed(1));
		}
	}
	}
});