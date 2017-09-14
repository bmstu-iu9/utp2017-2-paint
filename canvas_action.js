"use strict";



var c = document.getElementById( "topCanvas" );
var ctx = c.getContext( "2d" );
ctx.lineWidth = 2;
ctx.lineJoin = ctx.lineCap = 'round'; 

var bottomCanvas = document.getElementById( "bottomCanvas" );
var bottom_ctx = bottomCanvas.getContext( "2d" );
bottom_ctx.lineWidth = 2;
bottom_ctx.lineJoin = bottom_ctx.lineCap = 'round';


/**
 * Default color is black.
 * @type {string}
 */
var Color = '#000000';

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

var addt = document.getElementById("addText");
addt.addEventListener("click", clickOnText);



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

class Fill {
    constructor( pos1x, pos1y, pos2x, pos2y ){
      this.x = Math.floor(pos1x);
      this.y = Math.floor(pos1y);
      this.color = Color;
    }

    drawBottom(){
      var f = parseInt(String(this.color).substring(1), 16);
      var fillR = (f >> 16) & 255;
      var fillG = (f >> 8) & 255;
      var fillB = f & 255;
      var width = bottomCanvas.width;
      var height = bottomCanvas.height;
      var pixelStack = [];
      pixelStack.length = 10000000;
      var i = 0;
      var pixelPos = this.y*4*width + this.x*4;
      var ImD = bottom_ctx.getImageData(0,0,width,height);
      var r = ImD.data[pixelPos];
      var g = ImD.data[pixelPos + 1];
      var b = ImD.data[pixelPos + 2];
	
      var left = true;
      var right = true;
      var max = width*height*4 - 1;
      var checkDist;
      if(!(r == fillR && g == fillG && b == fillB)){
          pixelStack[i++] = pixelPos;
          while(i>0){
              left = right = true;
              pixelPos = pixelStack[--i];

              while(pixelPos>=width*4 && checkPixelColor(pixelPos-4*width))
                  pixelPos-=4*width;

              while(pixelPos<max && checkPixelColor(pixelPos)){
                  checkDist = pixelPos%(width*4);
                  if(checkDist!=0) {
                      if (checkPixelColor(pixelPos - 4)) {
                          if (left) {
                              pixelStack[i++] = pixelPos - 4;
                              left = false;
                          }
                      } 
                      else if (!left) left = true;
                  }
                  if(checkDist!=width-1) {
                      if (checkPixelColor(pixelPos + 4)) {
                          if (right) {
                              pixelStack[i++] = pixelPos + 4;
                              right = false;
                          }
                      } 
                      else if (!right) right = true;
                  }
                  changePixelColor(pixelPos);
                  pixelPos+=4*width;
              }
          }

          bottom_ctx.putImageData(ImD,0,0);
      }
      
      function checkPixelColor(pixelPos) {
          return ImD.data[pixelPos] == r
              && ImD.data[pixelPos+1] == g
              && ImD.data[pixelPos+2] == b;
      }

      function changePixelColor(pixelPos) {
          ImD.data[pixelPos] = fillR;
          ImD.data[pixelPos + 1] = fillG;
          ImD.data[pixelPos + 2] = fillB;
	  ImD.data[pixelPos + 3] = 255;
      }

    }
}

class Brush extends Pensil {
  constructor( pos1x, pos1y, pos2x, pos2y, color ) {
      super( pos1x, pos1y, pos2x, pos2y, color );
  }
  drawElement( pos1x, pos1y, pos2x, pos2y, ctx ) {
    var width=ctx.lineWidth;
    ctx.strokeStyle = this.color;
    ctx.lineWidth=width*2;
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
      ctx.fillStyle=this.color;
      ctx.beginPath();
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

class Text {
	constructor (pos1x, pos1y, pos2x, pos2y, color, t ) { 
			this.color = color;
			this.pos1x = pos1x;
			this.pos2x = pos2x;
			this.pos1y = pos1y;
			this.pos2y = pos2y;
			this.t = t;
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
objNameSpace.Fill=Fill;                  


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

c.addEventListener("mousedown", function( event ) {
  if (curStyle !== "None" && curStyle != "text") {
	startDrawing( event );
  }
});

c.addEventListener("mouseup", endDrawing);
document.addEventListener("mousemove", trackPosition);
/// Необходимо, тк были проблемы с выходом курсора с canvas
c.addEventListener("mouseleave", function(event) {
	c.addEventListener("mouseenter", function (event) {
	window.getSelection().removeAllRanges();});
});	

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
        if(curStyle === 'Pensil') {
            document.body.style.cursor = "url('data:image/x-icon;base64,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'), auto";
        }
        if(curStyle === 'Brush') {
            document.body.style.cursor = "url('data:image/x-icon;base64,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'), auto";
        }
        if(curStyle === 'Eraser') {
            document.body.style.cursor = "url('data:image/x-icon;base64,AAACAAEAICAAAAUAFgCoCAAAFgAAACgAAAAgAAAAQAAAAAEACAAAAAAAAAQAAAAAAAAAAAAAAAEAAAAAAACaYlEAnF9RAAAAAAA1NlcAamyuAJlhVwBvaKsAb22oAJ5jVABwb64AoaDBAHxeYQB9f5YAdXa6AIh1pQCWXFIA0cO0AJdeTwCZXk8AdGOdAF1agwCbYU8AXF2DAGxsrwBtbK8AbmqyAIWAxgBwbbIAkXFkAHFyrwCiZ1gAomhbAHd0rACFYE0AjV1WAJNfSgBrZqcAnFtQAJxeUACbX1MAbGutAGtssABpb7AAcGmwAG5urQBfWZMAcG6tAHJotgB2cKoAdHG2AHh1pwCOXU4AkVtRAHl9tgB6UkAAaGmxAK+szABqaK4AZm6uAJtgTgCcYVEAn2BOAG1rrgCbZVQAsXRuAIV8xQBvbLEAcGyxAHBrtwBvcLQAdG6uAHFwtACkaFQAdXG3AH1xpQBjY5cAZ2OgAHdkfwCXXEwAm1hJAJldTwCZX0wAammpAJpdTwBqaK8AamayAGtqrABsaqwAmWJVAJthUgCcYVIAnWFSAJ1fVQBwbbUAYmKMAHB1sgBVU2kA1bSmAGxTRQDQuq8Aena+AJpaRwBsbpUAjGNiAIGCrABsa54AnFxNAG1soQCbYFAAgnrBAGtqrQBvaLAAnmFTAHBusABwarYAoWVWAHRwrQByc60Ae3eeAGJojQBmZJMALiVXAGdinwCpbl8AmF5LAJdfTgBpZK4AmGFUAGhrsQCbYFEAa2quAJxeVAAhHkwAbWyrAIJ+xQBta7EAa3CuAG1stABvba4Ab2+rAHJvtAB0b7QAZmOIAD46aQBEPWkAYWmsAAsMIQCUYk8AfXnAAHpQRwCYX08AbGemAJhgUgBsaqYAml9PAGtnrwCcX08AmWNSAGtqrwBsbKwAb2ysAGtusgBuba8Ab2uyAJ9kVQBvbrIAcm+sAIaBxgB1cKYAdnWjAHRtuAAoKVMAiF5NAJN2cAB2dbUAKylTAKZqXgClb2QAaWiqAGdnsABoaa0AmV9QAJpfUAB6VkgAbWykAGZwsABqarAAgX/BAG5prQBsarAAbWqwAG1rswBxbacAn2NTAG9rswBvc6cAyc7cAI2PqQChZlwAc3GzAHtptgB2brwAZmWQAGljkwBmYK4AV1KFAKpxYgBvbY0AhmJsAJleTgBnbagAml5OAGlrqwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYXBjAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKcPEgzAgICAgICAgICAgICAgICAgICAgICAgICAgICt5Odf861lQICAgICAgICAgICAgICAgICAgICAgICAgI9BT9YxkAPOwICAgICAgICAgICAgICAgICAgICAgICrIFbAB9aJ7CxThMCAgICAgICAgICAgICAgICAgICAhw9WVlzUBWWtVt7ZzdeAgICAgICAgICAgICAgICAgICI5iBpAiBbIGBAQELGq5vaAICAgICAgICAgICAgICAgJRXFoemmxsbGwVgy+MMadFpgICAgICAgICAgICAgICAhAlCLbRmjyabHwOuRsbjQ27F2sCAgICAgICAgICAgICAq3BIX19EtMm0MmKKhsJG0eUZHLLAgICAgICAgICAgICAgJiT2pTESIrks91iYihpT7HQUkEOAICAgICAgICAgICAgICNmU0SoDIdAyOBiigQ8IsHYZEdgICAgICAgICAgICAgICAk2jRotCXcpgeSDAMqo5ol9tCgICAgICAgICAgICAgICAsRMvikuvzBpr4QtkKie0lY1AgICAgICAgICAgICAgICAgLFJG6HGL0ZzQMUj7jUUgICAgICAgICAgICAgICAgICAgICd5m8B586cavDVXoCAgICAgICAgICAgICAgICAgICAgICAhazm1eCslSRqQICAgICAgICAgICAgICAgICAgICAgICAgJ4uoW0fmYCAgICAgICAgICAgICAgICAgICAgICAgICAgICS8yXAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAv////////////////////////////////x////8P///+A////gH///wAf//4AB//+AAH//gAA//4AAD//AAAP/8AAA//wAAH//AAA//4AAP//gAH//+AD///4A////gf///+P//////////////////////////////////////'), auto";
        }
        if(curStyle === 'Spray') {
            document.body.style.cursor = "url('data:image/x-icon;base64,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'), auto";
        }
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

function clickOnFill() {
  curStyle = "Fill";
}

function clickOnText() {
  curStyle = "text";
  
}









