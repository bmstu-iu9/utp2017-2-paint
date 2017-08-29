"use strict";


document.onkeydown = handleKeyDown;

var bottomCanvas = document.getElementById( "bottomCanvas" );
var bottom_ctx = bottomCanvas.getContext( "2d" );


function handleKeyDown( evt ) {
    if ( evt.keyCode === 90 && evt.ctrlKey ) {
        undo();
    }

    if ( evt.keyCode === 89 && evt.ctrlKey ) {
        redo();
    }

    if ( evt.keyCode === 76 ) {
        curStyle = "Line";
    }

    if ( evt.keyCode === 80 ) {
        curStyle = "Pensil";
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


document.onclick = changeCursor;

function changeCursor(e) {
    if(e.target.id === "pencil") {
        document.body.style.cursor = 'text';
    }
}