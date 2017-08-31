"use strict";



var c = document.getElementById( "topCanvas" );
var ctx = c.getContext( "2d" );
ctx.lineWidth = 2;
ctx.lineJoin = ctx.lineCap = 'round'; 

var bottomCanvas = document.getElementById( "bottomCanvas" );
var bottom_ctx = bottomCanvas.getContext( "2d" );
bottom_ctx.lineWidth = 2;
bottom_ctx.lineJoin = bottom_ctx.lineCap = 'round';

bottom_ctx.fillStyle = "rgb(255,255,255)";
bottom_ctx.fillRect( 0 ,0 ,c.width ,c.height );
bottom_ctx.fillStyle = "rgb(0,0,255)";

/**
 * Default color is black.
 * @type {string}
 */
var Color = 'black';

/**
 * Set the selected color {@code Color}.
 * @Set the selected color {@code Color}
 * @type {string}
 */
document.getElementById('color').oninput = function () {
    Color = this.value;
    try {
        localStorage.setItem('savedColor', Color);
    } catch (e) {
        if (e == QUOTA_EXCEEDED_ERR) {
            alert('Превышен лимит хранилища!');
        }
    }
}

/**
 * Default visibility is 100%.
 * @type {string}
 */
var Visibility = 1;

/**
 * Set visibility {@code Visibility}.
 * @Get visibility from range {@code Visibility}
 * @type {string}
 */
document.getElementById('visible').oninput = function () {
    Visibility = this.value / 100;
    var visibleText = document.getElementById('visible-text');
    visibleText.value = this.value;
    try {
        localStorage.setItem('savedVisibility', Visibility);
    } catch (e) {
        if (e == QUOTA_EXCEEDED_ERR) {
            alert('Превышен лимит хранилища!');
        }
    }
}

/**
 * Set visibility {@code Visibility}.
 * @Get visibility from number input {@code Visibility}
 * @type {string}
 */
document.getElementById('visible-text').oninput = function () {
    Visibility = this.value / 100;
    var visibleRange = document.getElementById('visible');
    visibleRange.value = this.value;
    try {
        localStorage.setItem('savedVisibility', Visibility);
    } catch (e) {
        if (e == QUOTA_EXCEEDED_ERR) {
            alert('Превышен лимит хранилища!');
        }
    }
}

/**
 * Clear Canvas {@code}.
 * @Clear Canvas {@code}
 * @type {string}
 */
function clearCanvas () {
    bottom_ctx.clearRect(0, 0, bottomCanvas.width, bottomCanvas.height)
}

var objNameSpace = {};
var im_is = false;
var img_move = false;
var vector = { x_0:0 ,x_1:0 ,y_0:0 ,y_1:0};
var img_cur;
var img_size = false;
var img_size_right = false;
var img_size_left = false;
var img_size_top = false;
var img_size_bottom = false;
var img_size_corner = false;

/// Изначально пытался запихнать Line в отделтный файл objects.js,
/// но не получилось импортировать класс от туда.
/// Если есть варинат как сделать тнадо сделать
class Form {

    constructor( pos1x, pos1y, pos2x, pos2y ) {
        this.color = Color;
        this.visibility = Visibility;
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
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.globalAlpha = this.visibility;
        ctx.moveTo( this.pos1x, this.pos1y );
        ctx.lineTo( this.pos2x, this.pos2y );
        ctx.stroke();
        ctx.closePath();
    }

    drawBottom() {
        bottom_ctx.strokeStyle = this.color;
        bottom_ctx.beginPath();
        bottom_ctx.globalAlpha = this.visibility;
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
	    ctx.strokeRect(this.pos1x - 5,this.pos1y - 2 + (this.pos2y / 2),4,4);
	    ctx.strokeRect(this.pos2x + 1 + this.pos1x,this.pos1y - 2 + (this.pos2y / 2),4,4);
	    ctx.strokeRect(this.pos2x + this.pos1x,this.pos1y + 1 + this.pos2y,4,4);
	    ctx.strokeRect(this.pos1x - 2 + (this.pos2x / 2),this.pos1y - 5 ,4,4);
	    ctx.strokeRect(this.pos1x - 2 + (this.pos2x / 2) ,this.pos2y + this.pos1y,4,4);
	    ctx.stroke();
    	ctx.closePath();
    	ctx.lineWidth = 2;
	}
}

class Pensil {

    constructor( pos1x, pos1y, pos2x, pos2y ) {
        this.color = Color;
        this.visibility = Visibility;
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
        ctx.strokeStyle = this.color;
	ctx.globalAlpha = this.visibility;
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

class Brush extends Pensil {
  constructor( pos1x, pos1y, pos2x, pos2y, color ) {
      super( pos1x, pos1y, pos2x, pos2y, color );
  }
  drawElement( pos1x, pos1y, pos2x, pos2y, ctx ) {
    var width=ctx.lineWidth;
    ctx.lineWidth=width/3;
    ctx.globalAlpha = this.visibility;
    ctx.beginPath();

    ctx.moveTo(pos1x - ctx.lineWidth/2, pos1y - ctx.lineWidth/2);
    ctx.lineTo(pos2x - ctx.lineWidth/2, pos2y - ctx.lineWidth/2);
    ctx.stroke();

    ctx.moveTo(pos1x, pos1y);
    ctx.lineTo(pos2x, pos2y);
    ctx.stroke();

    ctx.moveTo(pos1x + ctx.lineWidth/2, pos1y + ctx.lineWidth/2);
    ctx.lineTo(pos2x + ctx.lineWidth/2, pos2y + ctx.lineWidth/2);
    ctx.stroke();

    this.pos1x = pos2x;
    this.pos1y = pos2y;
    ctx.lineWidth=width;
  }
}

class Spray extends Pensil {
  constructor( pos1x, pos1y, pos2x, pos2y, color ) {
      super( pos1x, pos1y, pos2x, pos2y, color );
  }
  drawElement( pos1x, pos1y, pos2x, pos2y, ctx ) {
      ctx.globalAlpha = this.visibility;
      var angle =getRandomFloat(0.1, Math.PI*2);
      var radius = getRandomFloat(0.1, ctx.lineWidth);
      ctx.fillStyle=Color;
      ctx.fillRect(
        pos2x + radius * Math.cos(angle),
        pos2y + radius * Math.sin(angle),
          1, 1);
    this.pos1x = pos2x;
    this.pos1y = pos2y;
  }
}

class Eraser extends Pensil {
  constructor( pos1x, pos1y, pos2x, pos2y, color ) {
      super( pos1x, pos1y, pos2x, pos2y, color );
  }

  drawElement( pos1x, pos1y, pos2x, pos2y, ctx ) {
        ctx.strokeStyle = "rgb(255, 255, 255)";
	ctx.globalAlpha = 100;
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

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function getDist( pos1x, pos1y, pos2x, pos2y ) {
    return Math.sqrt( Math.pow( pos1x - pos2x, 2 ) + Math.pow( pos1y - pos2y, 2 ) );
}

objNameSpace.Line = Line;
objNameSpace.Pensil = Pensil;
objNameSpace.Brush = Brush;
objNameSpace.Spray = Spray;
objNameSpace.Eraser = Eraser;


var pos;

function trackPosition( event ) {
    pos = getPos( event );
    window.getSelection().removeAllRanges();
    //отображение координат на канвасе
    var coords_on_move = document.getElementById('mouse_coords_on_move');
    if ( pos.x <= c.width && pos.y <= c.height &&
        pos.x >= 0 && pos.y >= 0) {
    	//coords_on_move.style.marginTop = c.height +10;
        coords_on_move.style.display = 'block';
        coords_on_move.innerHTML =
        'X: ' + Math.round(pos.x) +  
        ', Y: ' + Math.round(pos.y) + ', px';
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

    if ( img_size_right ){
    	ctx.clearRect( 0, 0, c.width, c.height );
    	img_cur.pos2x = pos.x - 2 - img_cur.pos1x;
    	img_cur.drawTop();
    	img_cur.drawFrame();
    }

    if ( img_size_left ){
    	ctx.clearRect( 0, 0, c.width, c.height );
    	img_cur.pos2x += img_cur.pos1x - pos.x - 2;
    	img_cur.pos1x = pos.x + 2;
    	img_cur.drawTop();
    	img_cur.drawFrame();
    }

    if ( img_size_top ){
    	ctx.clearRect( 0, 0, c.width, c.height );
    	img_cur.pos2y += img_cur.pos1y - pos.y - 2;
    	img_cur.pos1y = pos.y + 2;
    	img_cur.drawTop();
    	img_cur.drawFrame();
    }

    if ( img_size_bottom ){
    	ctx.clearRect( 0, 0, c.width, c.height );
    	img_cur.pos2y = pos.y - 2 - img_cur.pos1y;
    	img_cur.drawTop();
    	img_cur.drawFrame();
    }

    if ( img_size_corner ){
    	ctx.clearRect( 0, 0, c.width, c.height );
    	img_cur.pos2x = pos.x - 2 - img_cur.pos1x;
    	img_cur.pos2y = pos.y - 2 - img_cur.pos1y;
    	img_cur.drawTop();
    	img_cur.drawFrame();
    }
}


var curDrawing;
var curObject = null;
var objects = [];
var curPos = 0;
var curStyle = "None";
var curStyles = [];

/// Изначально было задуманно для передачи данных межу файлами, но вроде
/// и без этого работает
try {
    localStorage.setItem( "objects", objects );
    localStorage.setItem( "curPos", curPos );
    localStorage.setItem( "curStyles", curStyles );
} catch (e) {
    if (e == QUOTA_EXCEEDED_ERR) {
        alert('Превышен лимит хранилища!');
    }
}

c.onmousedown = function( event ) {
  if (curStyle !== "None")
  startDrawing( event );
}
c.onmouseup = endDrawing;
document.onmousemove = trackPosition;
/// Необходимо, тк были проблемы с выходом курсора с canvas
c.onmouseleave = function( event ) {
	if ( im_is ) {
		ctx.clearRect( 0, 0, c.width, c.height );
		img_cur.drawBottom();
		im_is = false;
		img_move = false;
	}
	endDrawing( event );
};
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
	img_move = false;
    if ( !im_is && curObject ) {
        curObject.drawBottom();
       	ctx.clearRect( 0, 0, c.width, c.height );
       	curPos = curPos > 0 ? curPos : 0;
        objects = objects.slice( 0, curPos );
        objects.push( curObject );
	curStyles = curStyles.slice( 0, curPos );                                  
        curStyles.push( curStyle );
        clearInterval( curDrawing );

        curPos = objects.length;
        curObject = null;
        curDrawing = null;

        try {
            localStorage.setItem( "objects", objects );
            localStorage.setItem( "curPos", curPos );
            localStorage.setItem( "curStyles", curStyles );
        } catch (e) {
            if (e == QUOTA_EXCEEDED_ERR) {
                alert('Превышен лимит хранилища!');
            }
        }

    }

	if ( img_size ) {
		img_size = false;
		img_size_right = false;
		img_size_left = false;
		img_size_top = false;
		img_size_bottom = false;
		img_size_corner = false;
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
        img_cur = img_obj;
        curPos = curPos > 0 ? curPos : 0;
        objects = objects.slice( 0, curPos );
        objects.push( img_obj );
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
	if ( pos.x >= img_cur.pos1x && pos.x <= img_cur.pos1x + img_cur.pos2x && 
		pos.y >= img_cur.pos1y && pos.y <= img_cur.pos1y + img_cur.pos2y ) {
		img_move = true;
		vector.x_0 = pos.x;
		vector.y_0 = pos.y;
		vector.x_1 = pos.x;
		vector.y_1 = pos.y;
	} else if ( pos.x >= img_cur.pos1x - 5 && pos.x <= img_cur.pos1x && 
		pos.y >= img_cur.pos1y + ( img_cur.pos2y / 2 ) - 3 &&  pos.y <= img_cur.pos1y + ( img_cur.pos2y / 2 ) + 3 ) {
		img_size_left = true;
		img_size = true;
	} else if ( pos.x <= img_cur.pos2x + img_cur.pos1x + 5 && pos.x >= img_cur.pos1x + img_cur.pos2x && 
		pos.y >= img_cur.pos1y + ( img_cur.pos2y / 2 ) - 3 &&  pos.y <= img_cur.pos1y + ( img_cur.pos2y / 2 ) + 3 ) {
		img_size_right = true;
		img_size = true;
	} else if ( pos.y >= img_cur.pos1y - 5 && pos.y <= img_cur.pos1y && 
		pos.x >= img_cur.pos1x + ( img_cur.pos2x / 2 ) - 3 &&  pos.x <= img_cur.pos1x + ( img_cur.pos2x / 2 ) + 3 ) {
		img_size_top = true;
		img_size = true;
	} else if ( pos.y >= img_cur.pos2y - 5 && pos.y <= img_cur.pos2y && 
		pos.x >= img_cur.pos1x + ( img_cur.pos2x / 2 ) - 3 &&  pos.x <= img_cur.pos1x + ( img_cur.pos2x / 2 ) + 3 ) {
		img_size_bottom = true;
		img_size = true;
	} else if ( pos.x >= img_cur.pos2x + img_cur.pos1x && pos.x <= img_cur.pos2x + img_cur.pos1x + 5 && 
		pos.y >= img_cur.pos2y + img_cur.pos1y && pos.y <= img_cur.pos2y + img_cur.pos1y + 5 ) {
		img_size_corner = true;
		img_size = true;
	} else {
		img_cur.drawBottom();
		img_move = false;
		im_is = false;
		startDrawing();
	}
}

if ( document.documentElement.clientHeight != 970) {
	reSize();
}

window.onresize = reSize;

function reSize() {
	document.getElementById('topCanvas').width = document.documentElement.clientWidth - 200;
	document.getElementById('bottomCanvas').height = document.documentElement.clientHeight - 200;
	document.getElementById('bottomCanvas').width = document.documentElement.clientWidth - 200;
	document.getElementById('topCanvas').height = document.documentElement.clientHeight - 200;
	bottom_ctx.fillStyle = "rgb(255,255,255)";
	bottom_ctx.fillRect( 0 ,0 ,c.width ,c.height );
	bottom_ctx.fillStyle = "rgb(0,0,255)";
	for( let i = 0; i < curPos; i++ ) {
        objects[i].drawBottom();
    }
	document.getElementById('mouse_coords_on_move').style.marginTop = "" + (c.height - 3) + "px";
	document.getElementById('for_save_block').style.width = "" + ( document.documentElement.clientWidth - 200 ) + "px";
	document.getElementById('for_save_block').style.height = "" + ( document.documentElement.clientHeight - 140 ) + "px";
	console.log(document.getElementById('for_save_block').style.width,document.getElementById('for_save_block').style.height);
	let a = ( ( ( document.documentElement.clientWidth - 200 ) / 2 ) - 15 );
	document.getElementById('done').style.marginLeft = "" + a + "px";
}

function settings() {
    if (localStorage.length != 0) {
        document.getElementById('color').value = localStorage.getItem('savedColor');
        Color = localStorage.getItem('savedColor');
        document.getElementById('visible').value = localStorage.getItem('savedVisibility') * 100;
        document.getElementById('visible-text').value = localStorage.getItem('savedVisibility') * 100;
        curStyle = localStorage.getItem('curStyle');
    }
}

function clickOnPensil() {
  curStyle = "Pensil";
  try {
      localStorage.setItem('curStyle', curStyle);
  } catch (e) {
      if (e == QUOTA_EXCEEDED_ERR) {
            alert('Превышен лимит хранилища!');
      }
  }
}

function clickOnBrush() {
  curStyle = "Brush";
    try {
        localStorage.setItem('curStyle', curStyle);
    } catch (e) {
        if (e == QUOTA_EXCEEDED_ERR) {
            alert('Превышен лимит хранилища!');
        }
    }
}

function clickOnEraser() {
  curStyle = "Eraser";
    try {
        localStorage.setItem('curStyle', curStyle);
    } catch (e) {
        if (e == QUOTA_EXCEEDED_ERR) {
            alert('Превышен лимит хранилища!');
        }
    }
}

function clickOnSpray() {
  curStyle = "Spray";
    try {
        localStorage.setItem('curStyle', curStyle);
    } catch (e) {
        if (e == QUOTA_EXCEEDED_ERR) {
            alert('Превышен лимит хранилища!');
        }
    }
}
