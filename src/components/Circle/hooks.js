import { dangers } from "../panel/hooks";
import { setBLock, setProm } from "../../slice";
import { Howler, Howl } from "howler";

const playSound = (src) => {
    const sound = new Howl({
        src
    });
    sound.play();
};

function updatePos (data, piece, position, dispatch) {
    console.log(data.dataGameRed);
    Howler.volume(1.0);
    playSound('move-chess.wav');
    let prom = false;
    let arrayData = data.piecePositions.slice();
    let dataPiece = data.piecePositions.find((element) => element.piece === piece.piece);
    let posFrame = data.positionsFrames.find((element) => element.position === position);
    const indexPiece = arrayData.indexOf(dataPiece);
    dataPiece.position = position;
    dataPiece.in = posFrame.frame;
    arrayData[indexPiece] = dataPiece;
    const numberKill = parseInt(posFrame.frame[1]);
    if (dataPiece.name === 'p' && dataPiece.color === 'black' && numberKill === 1) {
        dispatch(setProm({prom: true, color: dataPiece.color, value: null, indexPiece}));
        prom = true;

    } else if (dataPiece.name === 'p' && dataPiece.color === 'white' && numberKill === 8) {
        dispatch(setProm({prom: true, color: dataPiece.color, value: null, indexPiece}));
        prom = true;
    };
    
    if (dataPiece.name === 'k' || dataPiece.name === 'r') {
        dataPiece.move = true;
    };
    if (data.checkmate) {
        data.setCheckmate(false);
    };
    data.setPiecePositions(arrayData);
    data.setOnPiece(false);
    dangers(data, arrayData, true, false);
    if (!prom) {
        dispatch(setBLock(true));
        data.socket.emit('moveClient', {
            data: arrayData
        });
    }
}

function shortCastling (data, king, rook, posKing, posRook, dispatch) {
    playSound('move-chess.wav');
    let arrayData = data.piecePositions.slice();
    const indexKing = arrayData.indexOf(king);
    const indexRook = arrayData.indexOf(rook);
    const positionKing = data.positionsFrames.find((element) => element.frame === posKing);
    const positionRook = data.positionsFrames.find((element) => element.frame === posRook);
    arrayData[indexKing].in = positionKing.frame;
    arrayData[indexKing].position = positionKing.position;
    arrayData[indexKing].move = true;
    arrayData[indexRook].in = positionRook.frame;
    arrayData[indexRook].position = positionRook.position;
    data.setPiecePositions(arrayData);
    data.setOnPiece(false);
    dangers(data, arrayData, true, false);
    dispatch(setBLock(true));
    data.socket.emit('moveClient', {
        data: arrayData
    });
}

function detectMove (data, props, dispatch) {
    if (props.castling) {
        const dataCastling = props.castling;
        return shortCastling(data, dataCastling.king, dataCastling.rook, dataCastling.posKing, dataCastling.posRook, dispatch);
    } else {
        return updatePos(data, props.piece, props.position, dispatch);
    }
}

export {
    updatePos,
    shortCastling,
    detectMove,
    playSound
};