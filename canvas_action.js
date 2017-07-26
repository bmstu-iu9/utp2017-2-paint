"use strict";


var c = document.getElementById( "smile" );
var ctx = c.getContext( "2d" );


c.onmousedown = startDrawing;
c.onmouseup = endDrawing;


function startDrawing( event ) {
    let pos = getPos( event );

    ctx.moveTo( pos.x, pos.y );
}


function endDrawing( event ) {
    let pos = getPos( event );

    ctx.lineTo( pos.x, pos.y );
    ctx.stroke();
}


function getPos( event ) {
    let rect = c.getBoundingClientRect();

    return {
        x : event.clientX - rect.left,
        y : event.clientY - rect.top
    };
}
