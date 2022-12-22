import { dangers } from "../panel/hooks";
import { setProm } from "../../slice";
import { playSound } from "../Circle/hooks";
import { setBLock } from "../../slice";

function killPiece (piece, pieceKill, data, dispatch) {
    playSound('kill-chess.wav');
    let prom = false;
    const arrayPieces = data.piecePositions.slice();
    const indexKill = arrayPieces.indexOf(pieceKill);
    const piecePos = arrayPieces.find((element) => element.piece === piece.piece);
    const indexPiece = arrayPieces.indexOf(piecePos);
    arrayPieces[indexKill].dead = true;
    arrayPieces[indexPiece].in = pieceKill.in;
    arrayPieces[indexPiece].position = pieceKill.position;
    const numberKill = parseInt(pieceKill.in[1]);

    if (piecePos.name === 'p' && piecePos.color === 'black' && numberKill === 1) {
        dispatch(setProm({prom: true, color: piecePos.color, value: null, indexPiece}));
        prom = true;

    } else if (piecePos.name === 'p' && piecePos.color === 'white' && numberKill === 8) {
        dispatch(setProm({prom: true, color: piecePos.color, value: null, indexPiece}));
        prom = true;
    };

    if (piecePos.name === 'k' || piecePos.name === 'r') {
        piecePos.move = true;
    };

    if (data.checkmate) {
        data.setCheckmate(false);
    };
    
    data.setOnPiece(false);
    dangers(data, arrayPieces, true, false);
    if (!prom) {
        data.socket.emit('killClient', {
            data: arrayPieces
        });
        dispatch(setBLock(true));
    }
}   

export {
    killPiece
};