"use strict";


var c = document.getElementById( "topCanvas" );
var ctx = c.getContext( "2d" );
ctx.lineWidth = 2;

var bottomCanvas = document.getElementById( "bottomCanvas" );
var bottom_ctx = bottomCanvas.getContext( "2d" );
bottom_ctx.lineWidth = 2;


var objNameSpace = {};

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
        	this.pos1x + this.pos2x ,this.pos1y + this.pos2y);
    }

    drawBottom() {
        bottom_ctx.drawImage(this.image ,this.pos1x ,this.pos1y ,
        	this.pos1x + this.pos2x ,this.pos1y + this.pos2y);
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
}


var curDrawing;
var curObject = null;
var objects = [];
var curPos = 0;
var curStyle = "Line";

/// Изначально было задуманно для передачи данных межу файлами, но вроде
/// и без этого работает
localStorage.setItem( "objects", objects );
localStorage.setItem( "curPos", curPos );

c.onmousedown = startDrawing;
c.onmouseup = endDrawing;
c.onmousemove = trackPosition;
/// Необходимо, тк были проблемы с выходом курсора с canvas
<<<<<<< HEAD
c.onmouseleave = function( event ) { endDrawing( event ) };
c.onmouseenter = function( event ) { window.getSelection().removeAllRanges(); };
=======
c.onmouseleave = function( event ) { endDrawing( event ); };
c.onmouseenter = function( event ) { window.getSelection().removeAllRanges(); };


>>>>>>> 9b91982c56f8e287d4adb432d5d704e660afa3d5

/// Когда появятся другие элементы(круг и тд) должно быть изменено
function startDrawing( event ) {
    curObject = new objNameSpace[ curStyle ]( pos.x, pos.y, pos.x, pos.y );
    curDrawing = setInterval( changeAndDraw, 1 );
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
  //for(var i = 0; i < files.length; i++) {    
    file = files[0];
    if(/image.*/.test(file.type)) {
      fr = new FileReader();
      fr.readAsDataURL(file);
      fr.onload = (function (file) {
        return function (e) {       
          var img = new Image(),             
            s, td;       
          img.src = e.target.result;
          var img_obj = new Img(0,0,bottomCanvas.width,bottomCanvas.height,img);
          if(img.complete) {
            //bottom_ctx.drawImage(img,0,0,bottomCanvas.width,bottomCanvas.height);
            img_obj.drawBottom();
          } else {
            img.onload =  function () {
              //bottom_ctx.drawImage(img,0,0,bottomCanvas.width,bottomCanvas.height);
              img_obj.drawBottom();
            }
          }
 
        }
      }) (file);
    } else {
      alert('Файл не является изображением');
    }      
  //} 
}
 
if(window.File && window.FileReader && window.FileList && window.Blob) {
  onload = function () {
    document.querySelector('input').addEventListener('change', onFilesSelect, false);
  }
} else {
  alert('К сожалению ваш браузер не поддерживает file API');
}

function save(){
    //window.open(bottomCanvas.toDataURL('image/png'), 'new_window');
    //window.location = bottomCanvas.toDataURL();
 } 
