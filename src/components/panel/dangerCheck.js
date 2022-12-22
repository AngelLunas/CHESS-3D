import { simulateMove2, simulateKill2 } from "./move";
import { findDanger, findProtection } from "./hooks";
import { playSound } from "../Circle/hooks";
import { setPlaying, setEndGame, setColorWin, setEnemy } from "../../slice";

function checkmateValue (data, position, pos, arr) {
    const king = position.color === 'white' ? data.piecePositions[20] : data.piecePositions[4];
    if (simulateMove2(data, position, pos.position, king.in, king.color) === false) {
        arr.push(pos.frame);
    }
}

function checkmateKill (data, piece, pieceKill, arr) {
    const king = piece.color === 'white' ? data.piecePositions[20] : data.piecePositions[4];
    if (simulateKill2(piece, pieceKill, data, king.in) === false) {
        arr.push(pieceKill.in);
    }
}

function pawnMoves (data, numberPos, position, alphabet, number, numberPiece, numberPiecesPlayer, indexPiece, positions, kingData) {
    let frame1 = '';
    let frame2 = '';
    const letterPos = position.in[0];
    const indexLetter = alphabet.indexOf(position.in[0]);
    const letterRight = alphabet[indexLetter - 1];
    const letterLeft = alphabet[indexLetter + 1];
    const avalaibles = [];
    let numberRight = 0;
    let pieceFront = '';
    if (number === 7) {
        frame1 = `${letterPos}${numberPos - 1}`
        frame2 = `${letterPos}${numberPos - 2}`;
        pieceFront = `${letterPos}${numberPos - 1}`;
        numberRight = numberPiece - 1;
    } else if (number === 2) {
        frame1 = `${letterPos}${numberPos + 1}`;
        frame2 = `${letterPos}${numberPos + 2}`;
        pieceFront = `${letterPos}${numberPos + 1}`;
        numberRight = numberPiece + 1;
    };

    const diaRight = `${letterRight}${numberRight}`;
    const diaLeft = `${letterLeft}${numberRight}`;

    const pos1 = data.positionsFrames.find((element) => element.frame === frame1);
    const pos2 = data.positionsFrames.find((element) => element.frame === frame2);
    const pieceDiaR = positions.find((element) => element.in === diaRight && element.dead === false);
    const numberPieceDiaR = pieceDiaR ? parseInt(pieceDiaR.piece[1]) : null;
    const pieceDiaL = positions.find((element) => element.in === diaLeft && element.dead === false);
    const numberPieceDiaL = pieceDiaL ? parseInt(pieceDiaL.piece[1]) : null;
    const pieceFrontPos = positions.find((element) => element.in === pieceFront && element.dead === false);

    if (pieceDiaR && !numberPiecesPlayer.includes(numberPieceDiaR)) {
        if (simulateKill2(position, pieceDiaR, data, kingData.in) === false) {
            avalaibles.push(pieceDiaR.in);
        }
    };

    if (pieceDiaL && !numberPiecesPlayer.includes(numberPieceDiaL)) {
        if (simulateKill2(position, pieceDiaL, data, kingData.in) === false) {
            avalaibles.push(pieceDiaL.in);
        }
    };
    if (position.piece === position.in && !pieceFrontPos) {
        if (simulateMove2(data, position, pos1.position, kingData.in, kingData.color) === false) {
            avalaibles.push(pos1.frame);
        };
        if (simulateMove2(data, position, pos2.position, kingData.in, kingData.color) === false) {
            avalaibles.push(pos2.frame);
        };
    } else if (!pieceFrontPos){
        if (simulateMove2(data, position, pos1.position, kingData.in, kingData.color) === false) {
            avalaibles.push(pos1.frame);
        };
    };

    positions[indexPiece].available = avalaibles;
}

function rookMoves(piece, data, numberPiece, alphabet, indexPiece, positions, queen) {
    const letterPiece = piece.in[0];
    const arr = [];

    for (let i = numberPiece - 1; i > 0; i --) {
        const codePosition = `${letterPiece}${i}`;
        const position = data.positionsFrames.find((element) => element.frame === codePosition);
        const pieceFront = data.piecePositions.find((element) => element.in === codePosition && element.dead === false);
        
        if (pieceFront) {
            if (queen) {
                checkmateKill(data, piece, pieceFront, queen);
            } else {
                checkmateKill(data, piece, pieceFront, arr);
            }
            break;
        };
        if (queen) {
            checkmateValue(data, piece, position, queen);
        } else {
            checkmateValue(data, piece, position, arr);
        }
    };
    for (let i = numberPiece + 1; i <= 8; i++) {
        const codePosition = `${letterPiece}${i}`;
        const position = data.positionsFrames.find((element) => element.frame === codePosition);
        const pieceBack = data.piecePositions.find((element) => element.in === codePosition && element.dead === false);
        if (pieceBack) {
            if (queen) {
                checkmateKill(data, piece, pieceBack, queen);
            } else {
                checkmateKill(data, piece, pieceBack, arr);
            }
            break;
        };
        if (queen) {
            checkmateValue(data, piece, position, queen);
        } else {
            checkmateValue(data, piece, position, arr);
        }
    };

    const indexLetter = alphabet.indexOf(letterPiece);
    for (let i = indexLetter - 1; i >= 0; i--) {
        const codePosition = `${alphabet[i]}${numberPiece}`;
        const position = data.positionsFrames.find((element) => element.frame === codePosition);
        const pieceRight = data.piecePositions.find((element) => element.in === codePosition && element.dead === false);
        if (pieceRight) {
            if (queen) {
                checkmateKill(data, piece, pieceRight, queen);
            } else {
                checkmateKill(data, piece, pieceRight, arr);
            }
            break;
        };
        if (queen) {
            checkmateValue(data, piece, position, queen);
        } else {
            checkmateValue(data, piece, position, arr);
        }
    };

    for (let i = indexLetter + 1; i < 8; i++){
        const codePosition = `${alphabet[i]}${numberPiece}`;
        const position = data.positionsFrames.find((element) => element.frame === codePosition);
        const pieceLeft = data.piecePositions.find((element) => element.in === codePosition && element.dead === false);
        if (pieceLeft) {
            if (queen) {
                checkmateKill(data, piece, pieceLeft, queen);
            } else {
                checkmateKill(data, piece, pieceLeft, arr);
            }
            break;
        };
        if (queen) {
            checkmateValue(data, piece, position, queen);
        } else {
            checkmateValue(data, piece, position, arr);
        }
    };

    if (!queen) {
        positions[indexPiece].available = arr;
    }
};

function horseMoves(position, alphabet, numberPiece, data, indexPiece, positions) {
    const letter = position.in[0];
    const indexLetter = alphabet.indexOf(letter);
    const letter1 = alphabet[indexLetter - 1];
    const letter2 = alphabet[indexLetter + 1];
    const letter3 = alphabet[indexLetter - 2];
    const letter4 = alphabet[indexLetter + 2];
    const code1 = `${letter1}${numberPiece - 2}`;
    const code2 = `${letter2}${numberPiece - 2}`;
    const code3 = `${letter1}${numberPiece + 2}`;
    const code4 = `${letter2}${numberPiece + 2}`;
    const code5 = `${letter3}${numberPiece - 1}`;
    const code6 = `${letter3}${numberPiece + 1}`;
    const code7 = `${letter4}${numberPiece + 1}`;
    const code8 = `${letter4}${numberPiece - 1}`;
    const pos1 = data.positionsFrames.find((element) => element.frame === code1);
    const pos2 = data.positionsFrames.find((element) => element.frame === code2);
    const pos3 = data.positionsFrames.find((element) => element.frame === code3);
    const pos4 = data.positionsFrames.find((element) => element.frame === code4);
    const pos5 = data.positionsFrames.find((element) => element.frame === code5);
    const pos6 = data.positionsFrames.find((element) => element.frame === code6);
    const pos7 = data.positionsFrames.find((element) => element.frame === code7);
    const pos8 = data.positionsFrames.find((element) => element.frame === code8);
    const piece1 = positions.find((element) => element.in === code1 && element.dead === false);
    const piece2 = positions.find((element) => element.in === code2 && element.dead === false);
    const piece3 = positions.find((element) => element.in === code3 && element.dead === false);
    const piece4 =  positions.find((element) => element.in === code4 && element.dead === false);
    const piece5 =  positions.find((element) => element.in === code5 && element.dead === false);
    const piece6 =  positions.find((element) => element.in === code6 && element.dead === false);
    const piece7 =  positions.find((element) => element.in === code7 && element.dead === false);
    const piece8 =  positions.find((element) => element.in === code8 && element.dead === false);
    const arr = [];

    if (pos1 && !piece1) {
        checkmateValue(data, position, pos1, arr);
    } else if (pos1 && piece1) {
        checkmateKill(data, position, piece1, arr);
    }
    if (pos2 && !piece2) {
        checkmateValue(data, position, pos2, arr);
    } else if (pos2 && piece2) {
        checkmateKill(data, position, piece2, arr);
    };
    if (pos3 && !piece3) {
        checkmateValue(data, position, pos3, arr);
    } else if (pos3 && piece3) {
        checkmateKill(data, position, piece3, arr);
    };
    if (pos4 && !piece4) {
        checkmateValue(data, position, pos4, arr);
    } else if (pos4 && piece4) {
        checkmateKill(data, position, piece4, arr);
    };
    if (pos5 && !piece5) {
        checkmateValue(data, position, pos5, arr);
    } else if (pos5 && piece5) {
        checkmateKill(data, position, piece5, arr);
    };
    if (pos6 && !piece6) {
        checkmateValue(data, position, pos6, arr);
    } else if (pos6 && piece6) {
        checkmateKill(data, position, piece6, arr);
    };
    if (pos7 && !piece7) {
        checkmateValue(data, position, pos7, arr);
    } else if (pos7 && piece7) {
       checkmateKill(data, position, piece7, arr);
    };
    if (pos8 && !piece8) {
        checkmateValue(data, position, pos8, arr);
    } else if (pos8 && piece8){
        checkmateKill(data, position, piece8, arr);
    };

    positions[indexPiece].available = arr;
}

function bishopMoves(numberPiece, alphabet, data, indexPiece, positions, piece, queen) {
    let j = numberPiece - 1;
    let letter = piece.in[0];
    const indexLetter = alphabet.indexOf(letter);
    let b = indexLetter - 1; 
    let c = indexLetter - 1; 
    const arr = [];

    for (let i = indexLetter + 1; i < 8; i++) {
        const codePosition = `${alphabet[i]}${j}`;
        const piecePosition = data.positionsFrames.find((element) => element.frame === codePosition);
        const pieceFront = data.piecePositions.find((element) => element.in === codePosition && element.dead === false);
        if (pieceFront) {
            if (queen) {
                checkmateKill(data, piece, pieceFront, queen);
            } else {
                checkmateKill(data, piece, pieceFront, arr);
            }
            break;
        };

      if (piecePosition) {
            if (queen) {
                checkmateValue(data, piece, piecePosition, queen);
            } else {
                checkmateValue(data, piece, piecePosition, arr);
            }
        };

        j -= 1;
    };

    for (let i = numberPiece + 1; i <= 8; i++) {
        const codePosition = `${alphabet[b]}${i}`;
        const pos = data.positionsFrames.find((element) => element.frame === codePosition);
        const pieceBack = data.piecePositions.find((element) => element.in === codePosition && element.dead === false);
        if (pieceBack) {
            if (queen) {
                checkmateKill(data, piece, pieceBack, queen);
            } else {
                checkmateKill(data, piece, pieceBack, arr);
            }
            break;
        };

        if (pos) {
            if (queen) {
                checkmateValue(data, piece, pos, queen);
            } else {
                checkmateValue(data, piece, pos, arr);
            }
        };

        b -= 1;
    };

    for (let i = numberPiece - 1; i > 0; i--) {
        const codePosition = `${alphabet[c]}${i}`;
        const pos = data.positionsFrames.find((element) => element.frame === codePosition);
        const pieceFront = data.piecePositions.find((element) => element.in === codePosition && element.dead === false);
        if (pieceFront) {
            if (queen) {
                checkmateKill(data, piece, pieceFront, queen);
            } else {
                checkmateKill(data, piece, pieceFront, arr);
            }
            break;
        };

        if (pos) {
            if (queen) {
                checkmateValue(data, piece, pos, queen);
            } else {
                checkmateValue(data, piece, pos, arr);
            }
        };

        c -= 1;
    };
    let z = numberPiece + 1;
    for (let i = indexLetter + 1; i < 8; i++) {
        const codePosition = `${alphabet[i]}${z}`;
        const pos = data.positionsFrames.find((element) => element.frame === codePosition);
        const pieceBack = data.piecePositions.find((element) => element.in === codePosition && element.dead === false);
        if (pieceBack) {
            if (queen) {
                checkmateKill(data, piece, pieceBack, queen);
            } else {
                checkmateKill(data, piece, pieceBack, arr);
            }
            break;
        };

        if (pos) {
            if (queen) {
                checkmateValue(data, piece, pos, queen);
            } else {
                checkmateValue(data, piece, pos, arr);
            }
        };

        z += 1;
    }

    if (!queen) {
        positions[indexPiece].available = arr;
    }
}

function queenMoves (data, alphabet, numberPiece, position, indexPiece, positions) {
    const arr = [];
    bishopMoves(numberPiece, alphabet, data, indexPiece, positions, position, arr);
    rookMoves(position, data, numberPiece, alphabet, indexPiece, positions, arr);
    positions[indexPiece].available = arr;
}

function kingMoves (data, alphabet, numberPiece, piece, indexPiece, positions) {
    const letter = piece.in[0];
    const indexLetter = alphabet.indexOf(letter);
    const code1 = `${letter}${numberPiece + 1}`;
    const code2 = `${letter}${numberPiece - 1}`;
    const code3 = `${alphabet[indexLetter - 1]}${numberPiece}`;
    const code4 = `${alphabet[indexLetter + 1]}${numberPiece}`;
    const code5 = `${alphabet[indexLetter - 1]}${numberPiece - 1}`;
    const code6 = `${alphabet[indexLetter + 1]}${numberPiece - 1}`;
    const code7 = `${alphabet[indexLetter - 1]}${numberPiece + 1}`;
    const code8 = `${alphabet[indexLetter + 1]}${numberPiece + 1}`;
    const pos1 = data.positionsFrames.find((element) => element.frame === code1);
    const pos2 = data.positionsFrames.find((element) => element.frame === code2);
    const pos3 = data.positionsFrames.find((element) => element.frame === code3);
    const pos4 = data.positionsFrames.find((element) => element.frame === code4);
    const pos5 = data.positionsFrames.find((element) => element.frame === code5);
    const pos6 = data.positionsFrames.find((element) => element.frame === code6);
    const pos7 = data.positionsFrames.find((element) => element.frame === code7);
    const pos8 = data.positionsFrames.find((element) => element.frame === code8);
    const piece1 = positions.find((element) => element.in === code1 && element.dead === false);
    const piece2 = positions.find((element) => element.in === code2 && element.dead === false);
    const piece3 = positions.find((element) => element.in === code3 && element.dead === false);
    const piece4 = positions.find((element) => element.in === code4 && element.dead === false);
    const piece5 = positions.find((element) => element.in === code5 && element.dead === false);
    const piece6 = positions.find((element) => element.in === code6 && element.dead === false);
    const piece7 = positions.find((element) => element.in === code7 && element.dead === false);
    const piece8 = positions.find((element) => element.in === code8 && element.dead === false);
    const arr = [];

    if (pos1 && !piece1) {
        if (findDanger(pos1.frame, piece.color, positions) === false) {
            arr.push(pos1.frame);
        }
    } else if (piece1) {
        if (piece.color !== piece1.color && findProtection(piece1.in, data, piece1.color) === false) {
            arr.push(piece1.in);
        }
    };

    if (pos2 && !piece2) {
        if (findDanger(pos2.frame, piece.color, positions) === false) {
            arr.push(pos2.frame);
        }
    } else if (piece2) {
        if (piece.color !== piece2.color && findProtection(piece2.in, data, piece2.color) === false) {
            arr.push(piece2.in);
        }
    };

    if (pos3 && !piece3) {
        if (findDanger(pos3.frame, piece.color, positions) === false) {
            arr.push(pos3.frame);
        }
    } else if (piece3) {
        if (piece.color !== piece3.color && findProtection(piece3.in, data, piece3.color) === false) {
            arr.push(piece3.in);
        }
    };

    if (pos4 && !piece4) {
        if (findDanger(pos4.frame, piece.color, positions) === false) {
            arr.push(pos4.frame);
        }
    } else if (piece4) {
        if (piece.color !== piece4.color && findProtection(piece4.in, data, piece4.color) === false) {
            arr.push(piece4.in);
        }
    };

    if (pos5 && !piece5) {
        if (findDanger(pos5.frame, piece.color, positions) === false) {
            arr.push(pos5.frame);
        }
    } else if (piece5) {
        if (piece.color !== piece5.color && findProtection(piece5.in, data, piece5.color) === false) {
            arr.push(piece5.in);
        }
    };

    if (pos6 && !piece6) {
        if (findDanger(pos6.frame, piece.color, positions) === false) {
            arr.push(pos6.frame);
        }
    } else if (piece6) {
        if (piece.color !== piece6.color && findProtection(piece6.in, data, piece6.color) === false) {
            arr.push(piece6.in);
        }
    };

    if (pos7 && !piece7) {
        if (findDanger(pos7.frame, piece.color, positions) === false) {
            arr.push(pos7.frame);
        }
    } else if (piece7) {
        if (piece.color !== piece7.color && findProtection(piece7.in, data, piece7.color) === false) {
            arr.push(piece7.in);
        }
    };

    if (pos8 && !piece8) {
        if (findDanger(pos8.frame, piece.color, positions) === false) {
            arr.push(pos8.frame);
        }
    } else if (piece8) {
        if (piece.color !== piece8.color && findProtection(piece8.in, data, piece8.color) === false) {
            arr.push(piece8.in);
        }
    };
    
    positions[indexPiece].available = arr;
}

function checkCheckmate (data, color) {
    const start = color === 'black' ? 0 : 16;
    const end = color === 'black' ? 15 : 31;
    const pieces = data.piecePositions.slice();
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const numberPiecesPlayer = data.player === 'black' ? [8, 7] : [1, 2];
    const king = color === 'white' ? pieces[20] : pieces[4];

    for (let i = start; i <=  end; i++) {
        if (pieces[i].dead === false) {
            const numberPos = parseInt(pieces[i].in[1]);
            const number = parseInt(pieces[i].piece[1]);
            switch (pieces[i].name) {
                case 'p':
                    pawnMoves(data, numberPos, pieces[i], alphabet, number, numberPos, numberPiecesPlayer, i, pieces, king);
                    break;
                case 'r':
                    rookMoves(pieces[i], data, numberPos, alphabet, i, pieces);
                    break;
                case 'h':
                    horseMoves(pieces[i], alphabet, numberPos, data, i, pieces);
                    break;
                case 'b':
                    bishopMoves(numberPos, alphabet, data, i, pieces, pieces[i]);
                    break;
                case 'q':
                    queenMoves(data, alphabet, numberPos, pieces[i], i, pieces);
                    break;
                case 'k':
                    kingMoves(data, alphabet, numberPos, pieces[i], i, pieces);
                    break;
                default:
                    break;
            };
        };
    };

    data.setPiecePositions(pieces);

    for (let i = start; i <= end; i++) {
        if (pieces[i].available.length > 0) {
            return false;
        }
    };

    return true;
}

function valideCheckmate (data, color) {
    if (checkCheckmate(data, color) === true) {
        data.dispatch(setColorWin(data.player));
        playSound('win-chess.mp3');
        data.socket.emit('checkmate2', {
            data: data.piecePositions
        });
        data.dispatch(setPlaying(false));
        data.dispatch(setEndGame(true));
        data.dispatch(setEnemy(null));
    } else {
        data.socket.emit('checkmate1', {
            data: data.piecePositions
        });
    }
}


export {
    checkCheckmate,
    valideCheckmate
};