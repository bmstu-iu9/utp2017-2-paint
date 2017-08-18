"use strict";


var c = document.getElementById( "topCanvas" );
var ctx = c.getContext( "2d" );
ctx.lineWidth = 2;

var bottomCanvas = document.getElementById( "bottomCanvas" );
var bottom_ctx = bottomCanvas.getContext( "2d" );
bottom_ctx.lineWidth = 2;

var objNameSpace = {};
var im_is = false;
var img_move = false;
var vector = { x_0:0 ,x_1:0 ,y_0:0 ,y_1:0};
var img_cur;

/// Изначально пытался запихнать Line в отделтный файл objects.js,
/// но не получилось импортировать класс от туда.
/// Если есть варинат как сделать тнадо сделать
class Form {

    constructor( pos1x, pos1y, pos2x, pos2y ) {
        this.pos1x = pos1x;
        this.pos1y = pos1y;
        this.pos2x = pos2x;
        this.pos2y = pos2y;
        this.type = "figure";
    }

    drawTop() {
    	alert('T');
    }

    drawBottom() {
    	alert('B');
    }

    set2( pos2x, pos2y ) {
        this.pos2x = pos2x;
        this.pos2y = pos2y;
    }
}

class Line extends Form {

    constructor( pos1x, pos1y, pos2x, pos2y ) {
        super( pos1x, pos1y, pos2x, pos2y );
    }

    drawTop() {
        ctx.beginPath();
        ctx.moveTo( this.pos1x, this.pos1y );
        ctx.lineTo( this.pos2x, this.pos2y );
        ctx.stroke();
        ctx.closePath();
    }

    drawBottom() {
        bottom_ctx.beginPath();
        bottom_ctx.moveTo( this.pos1x, this.pos1y );
        bottom_ctx.lineTo( this.pos2x, this.pos2y );
        bottom_ctx.stroke();
        bottom_ctx.closePath();
    }
}

class Img extends Form {
	constructor( pos1x, pos1y, pos2x, pos2y , image ) {
        super( pos1x, pos1y, pos2x, pos2y );
        this.image = image;
    }

    drawTop() {
        ctx.drawImage(this.image ,this.pos1x ,this.pos1y ,
        	this.pos2x ,this.pos2y);
    }

    drawBottom() {
        bottom_ctx.drawImage(this.image ,this.pos1x ,this.pos1y ,
        this.pos2x ,this.pos2y);
    }

    drawFrame() {
		ctx.beginPath();
		ctx.fillStyle="rgb(0,0,255)"
		ctx.lineWidth = 1;
	    ctx.moveTo( this.pos1x, this.pos1y );
	    ctx.lineTo( this.pos1x, this.pos2y + this.pos1y );
	    ctx.stroke();
	    ctx.lineTo( this.pos2x + this.pos1x, this.pos2y + this.pos1y);
	    ctx.stroke();
	    ctx.lineTo( this.pos2x + this.pos1x, this.pos1y );
	    ctx.stroke();
	    ctx.lineTo( this.pos1x, this.pos1y );
	    ctx.stroke();
	    ctx.strokeRect(this.pos1x - 5,this.pos1y - 5,4,4);
	    ctx.strokeRect(this.pos2x + 1 + this.pos1x,this.pos1y - 5,4,4);
	    ctx.strokeRect(this.pos2x + this.pos1x,this.pos1y + 1 + this.pos2y,4,4);
	    ctx.strokeRect(this.pos1x - 5,this.pos2y + this.pos1y,4,4);
	    ctx.stroke();
    	ctx.closePath();
	}
}

class Pensil {

    constructor( pos1x, pos1y, pos2x, pos2y ) {
        this.pos1x = pos1x;
        this.pos1y = pos1y;
        this.pos2x = pos2x;
        this.pos2y = pos2y;
        this.type = "brush";
        this.points = [ { x : pos1x, y : pos1y } ];
    }

    set2( pos2x, pos2y ) {
        this.points.push( { x : pos2x, y : pos2y } );
        this.pos1x = this.pos2x;
        this.pos1y = this.pos2y;
        this.pos2x = pos2x;
        this.pos2y = pos2y;
    }

    drawBottom() {
        for ( let i = 0; i < this.points.length - 1 ; i++ ) {
            this.drawElement( this.points[ i ].x, this.points[ i ].y,
                              this.points[ i + 1 ].x, this.points[ i + 1 ].y,
                              bottom_ctx );
        }
    }

    drawTop() {
        this.drawElement( this.pos1x, this.pos1y, this.pos2x, this.pos2y, ctx );
    }

    drawElement( pos1x, pos1y, pos2x, pos2y, ctx ) {
        ctx.beginPath();
        if ( getDist( pos1x, pos1y, pos2x, pos2y ) > 0.5 ) {
            ctx.moveTo( pos1x, pos1y );
            ctx.lineTo( pos2x, pos2y );
        } else {
            ctx.arc( pos1x, pos1y, 0.1, 0, 2*Math.PI );
            ctx.fill();
        }
        ctx.stroke();
        ctx.closePath();
    }
}

function getDist( pos1x, pos1y, pos2x, pos2y ) {
    return Math.sqrt( Math.pow( pos1x - pos2x, 2 ) + Math.pow( pos1y - pos2y, 2 ) );
}

objNameSpace.Line = Line;
objNameSpace.Pensil = Pensil;


var pos;

function trackPosition( event ) {
    pos = getPos( event );
    window.getSelection().removeAllRanges();
    //отображение координат на канвасе
    var coords_on_move = document.getElementById('mouse_coords_on_move');
    if ( pos.x <= c.width && pos.y <= c.height &&
        pos.x >= 0 && pos.y >= 0) {
        coords_on_move.style.display = 'block';
        coords_on_move.innerHTML =
        'X: ' + pos.x +  
        ', Y: ' + pos.y + ', px';
    } else {
        coords_on_move.style.display = 'none';
    }

    if ( img_move ) {
    	ctx.clearRect( 0, 0, c.width, c.height );
    	vector.x_0 = vector.x_1;
    	vector.y_0 = vector.y_1;
    	vector.x_1 = pos.x;
    	vector.y_1 = pos.y;
    	img_cur.pos1x += vector.x_1 - vector.x_0;
    	img_cur.pos1y += vector.y_1 - vector.y_0;
    	img_cur.drawTop();
    	img_cur.drawFrame();
    }
}


var curDrawing;
var curObject = null;
var objects = [];
var curPos = 0;
var curStyle = "Pensil";

/// Изначально было задуманно для передачи данных межу файлами, но вроде
/// и без этого работает
localStorage.setItem( "objects", objects );
localStorage.setItem( "curPos", curPos );

c.onmousedown = startDrawing;
c.onmouseup = endDrawing;
document.onmousemove = trackPosition;
/// Необходимо, тк были проблемы с выходом курсора с canvas
c.onmouseleave = function( event ) { endDrawing( event ) };
c.onmouseenter = function( event ) { window.getSelection().removeAllRanges(); };
/// Когда появятся другие элементы(круг и тд) должно быть изменено
function startDrawing( event ) {
	if ( im_is ) {
		img_place();
	} else {
    	curObject = new objNameSpace[ curStyle ]( pos.x, pos.y, pos.x, pos.y );
   		curDrawing = setInterval( changeAndDraw, 1 );
	}
}


function changeAndDraw() {
    curObject.set2( pos.x, pos.y );
    if ( curObject.type === "figure" ) {
        ctx.clearRect( 0, 0, c.width, c.height );
    }
    curObject.drawTop();
}

/// Переносит результат на bottomCanvas
function endDrawing( event ) {
	if ( !im_is ) {
    	if ( curObject ) {
        	curObject.drawBottom();
       		ctx.clearRect( 0, 0, c.width, c.height );
        	curPos = curPos > 0 ? curPos : 0;
        	objects = objects.slice( 0, curPos );
        	objects.push( curObject );
        	clearInterval( curDrawing );

        	curPos = objects.length;
        	curObject = null;
        	curDrawing = null;

        	localStorage.setItem( "objects", objects );
        	localStorage.setItem( "curPos", curPos );
    	}
	} else {
		img_move = false;
	}
}


function getPos( event ) {
    let rect = c.getBoundingClientRect();

    return {
        x : event.clientX - rect.left,
        y : event.clientY - rect.top
    };
}

function onFilesSelect(e) {
  var files = e.target.files,fr,file;   
  file = files[0];
  if(/image.*/.test(file.type)) {
    fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onload = (function (file) {
      return function (e) {     
        var img = new Image(),             
          s, td;       
        img.src = e.target.result;
        var img_obj = new Img( 20 ,20 ,200 ,200 ,img );
        if ( img.complete ) {
			im_is = true;
          	img_obj.drawTop();
        } else { 
        	img.onload =  function () {
          		im_is = true;
          		img_obj.drawTop();
          	}	
        }
        img_obj.drawFrame();
        curPos = curPos > 0 ? curPos : 0;
        objects = objects.slice( 0, curPos );
        objects.push( curObject );
        curPos = objects.length;
      }
    }) (file);
  } else {
    alert('Файл не является изображением');
  }      
}
 
if(window.File && window.FileReader && window.FileList && window.Blob) {
  onload = function () {
    document.querySelector('input').addEventListener('change', onFilesSelect, false);
  }
} else {
  alert('К сожалению ваш браузер не поддерживает file API');
}

function save() {
	var im = document.getElementById('for_save_place');
	im.src=bottomCanvas.toDataURL('image/png');
	im.onload = function () {
		document.getElementById('for_save_block').style.display='block';
	}
}

function done() {
	document.getElementById('for_save_block').style.display='none';
}

function img_place() {
	vector.x_0 = pos.x;
	vector.y_0 = pos.y;
	vector.x_1 = pos.x;
	vector.y_1 = pos.y;
	img_cur = objects[curPos-1];
	ctx.clearRect( 0, 0, c.width, c.height );
	if ( pos.x >= img_cur.pos1x && pos.x <= img_cur.pos1x + img_cur.pos2x && 
		pos.y >= img_cur.pos1y && pos.y <= img_cur.pos1y + img_cur.pos2y ){
		img_move = true;
	} else {
		img_cur.drawBottom();
		img_move = false;
		im_is = false;
	}
}
