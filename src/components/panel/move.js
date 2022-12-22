import { findDanger, dangers } from './hooks';

function simulateKill (piece, pieceKill, data) {
    const arrayPieces = data.piecePositions.slice();
    const indexKill = arrayPieces.indexOf(pieceKill);
    const indexPiece = arrayPieces.indexOf(piece);
    const pieceKillData = JSON.parse(JSON.stringify(pieceKill));
    pieceKillData.dead = true;
    const pieceData = JSON.parse(JSON.stringify(piece));
    pieceData.in = pieceKillData.in;
    pieceData.position = pieceKillData.position;
    arrayPieces[indexKill] = pieceKillData;
    arrayPieces[indexPiece] = pieceData;
    const newArray = dangers(data, arrayPieces, false, true);
    return findDanger(data.checkmate.piece, piece.color, newArray);
}

function simulateKill2 (piece, pieceKill, data, checkmate) {
    const arrayPieces = data.piecePositions.slice();
    const indexKill = arrayPieces.indexOf(pieceKill);
    const indexPiece = arrayPieces.indexOf(piece);
    const pieceKillData = JSON.parse(JSON.stringify(pieceKill));
    pieceKillData.dead = true;
    const pieceData = JSON.parse(JSON.stringify(piece));
    pieceData.in = pieceKillData.in;
    pieceData.position = pieceKillData.position;
    arrayPieces[indexKill] = pieceKillData;
    arrayPieces[indexPiece] = pieceData;
    const newArray = dangers(data, arrayPieces, false, true);
    return findDanger(checkmate, piece.color, newArray);
}

function simulateMove (data, piece, position, checkmate) {
    const arrayData = data.piecePositions.slice();
    let posFrame = data.positionsFrames.find((element) => element.position === position);
    const indexPiece = arrayData.indexOf(piece);
    const newPiece = JSON.parse(JSON.stringify(piece));
    newPiece.position = position;
    newPiece.in = posFrame.frame;
    arrayData[indexPiece] = newPiece;
    const newArray = dangers(data, arrayData, false, true);
    return findDanger(checkmate, piece.color, newArray);
};

function simulateMove2 (data, piece, position, checkmate, color) {
    const arrayData = data.piecePositions.slice();
    let posFrame = data.positionsFrames.find((element) => element.position === position);
    const indexPiece = arrayData.indexOf(piece);
    const newPiece = JSON.parse(JSON.stringify(piece));
    newPiece.position = position;
    newPiece.in = posFrame.frame;
    arrayData[indexPiece] = newPiece;
    const newArray = dangers(data, arrayData, false, true);
    return findDanger(checkmate, color, newArray);
};

export { simulateMove, simulateKill, simulateMove2, simulateKill2 };