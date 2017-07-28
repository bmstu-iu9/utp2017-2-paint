"use strict";


var c = document.getElementById( "topCanvas" );
var ctx = c.getContext( "2d" );

var bottomCanvas = document.getElementById( "bottomCanvas" );
var bottom_ctx = bottomCanvas.getContext( "2d" );

/// Изначально пытался запихнать Line в отделтный файл objects.js,
/// но не получилось импортировать класс от туда.
/// Если есть варинат как сделать тнадо сделать
class Line {

    constructor( pos1x, pos1y, pos2x, pos2y ) {
        this.pos1x = pos1x;
        this.pos1y = pos1y;
        this.pos2x = pos2x;
        this.pos2y = pos2y;

        console.log( pos1x, pos1y, pos2x, pos2y );
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

    set2( pos2x, pos2y ) {
        this.pos2x = pos2x;
        this.pos2y = pos2y;
    }
}


var pos;

function trackPosition( event ) {
    pos = getPos( event );
}


var curDrawing;
var curObject;

c.onmousedown = startDrawing;
c.onmouseup = endDrawing;
c.onmousemove = trackPosition;
/// Необходимо, тк были проблемы с выходом курсора с canvas
c.onmouseleave = function( event ) { endDrawing( event ) };
c.onmouseenter = function( event ) { window.getSelection().removeAllRanges(); };

/// Когда появятся другие элементы(круг и тд) должно быть изменено
function startDrawing( event ) {
    curObject = new Line( pos.x, pos.y, pos.x, pos.y );
    curDrawing = setInterval( changeAndDraw, 1 );
}


function changeAndDraw() {
    curObject.set2( pos.x, pos.y );
    ctx.clearRect( 0, 0, c.width, c.height );
    curObject.drawTop();
}

/// Переносит результат на bottomCanvas
function endDrawing( event ) {
    curObject.drawBottom();
    clearInterval( curDrawing );
}


function getPos( event ) {
    let rect = c.getBoundingClientRect();

    return {
        x : event.clientX - rect.left,
        y : event.clientY - rect.top
    };
}
