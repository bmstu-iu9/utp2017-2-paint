"use strict";


document.onkeydown = handleKeyDown;

var bottomCanvas = document.getElementById( "bottomCanvas" );
var bottom_ctx = bottomCanvas.getContext( "2d" );


function handleKeyDown( evt ) {
    console.log( evt.keyCode );
    if ( evt.keyCode === 90 && evt.ctrlKey ) {
        undo();
        console.log( "why" );
    }

    if (evt.keyCode === 89 && evt.ctrlKey ) {
        redo();
    }
};


function undo() {
    bottom_ctx.clearRect( 0, 0, bottomCanvas.width, bottomCanvas.height );
    for( let i = 0; i < curPos-1; i++ ) {
        objects[i].drawBottom();
    }
    curPos--;
}


function redo() {
    curPos = curPos > 0 ? curPos : 0;
    if( curPos < objects.length ) {
        bottom_ctx.clearRect( 0, 0, bottomCanvas.width, bottomCanvas.height );
        for( let i = 0; i < curPos+1; i++ ) {
            objects[i].drawBottom();
        }
        curPos++;
    }
}
