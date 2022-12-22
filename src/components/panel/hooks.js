import React from "react";
import Frame from '../box/index';
import { RookModel } from "../../models/Rook";
import { HorseModel } from "../../models/Horse";
import { BishopModel } from "../../models/Bishop";
import { QueenModel } from "../../models/Queen";
import { KingModel } from "../../models/King";
import { PawnModel } from "../../models/Pawn";
import { simulateMove, simulateKill, simulateMove2, simulateKill2 } from "./move";
import BoxSelect from "../boxSelect";
import CircleMove from "../Circle";
import BoxEnemy from "../boxEnemy";
import { valideCheckmate } from "./dangerCheck";

function setRotationPanel (color) {
    if (color === 'white') {
        return [0, 3.15, 0]
    } else {
        return [0, 0, 0]
    };
}

function checkmateValue (data, components, position, pos, key) {
    if (data.checkmate && data.checkmate.color === data.player) {
        if (simulateMove(data, position, pos.position, data.checkmate.piece) === false) {
            components.push(<CircleMove key={key} position={pos.position} piece={data.onPiece}/>);
        }
    } else {
        const king = data.player === 'white' ? data.piecePositions[20] : data.piecePositions[4];
        if (simulateMove2(data, position, pos.position, king.in, king.color) === false) {
            components.push(<CircleMove key={key} position={pos.position} piece={data.onPiece}/>);
        }
    }
}

function checkmateKill (data, components, piece, pieceKill, key) {
    if (piece.color !== pieceKill.color) {
        if (data.checkmate && piece.color === data.player) {
            if (simulateKill(piece, pieceKill, data) === false) {
                const x = pieceKill.position[0] - 0.25;
                const y = pieceKill.position[1] - 1;
                const z = pieceKill.position[2] - 0.25;
                components.push(<BoxEnemy key={key} position={[x, y, z]} pieceKill={pieceKill} piece={data.onPiece}/>);
            }
        } else {
            const king = data.player === 'white' ? data.piecePositions[20] : data.piecePositions[4];
            if (simulateKill2(piece, pieceKill, data, king.in) === false) {
                const x = pieceKill.position[0] - 0.25;
                const y = pieceKill.position[1] - 1;
                const z = pieceKill.position[2] - 0.25;
                components.push(<BoxEnemy key={key} position={[x, y, z]} pieceKill={pieceKill} piece={data.onPiece}/>);
            }
        }
    };
}

function findDanger (piecee, color, pieces) {
    const start = color === 'black' ? 16 : 0;
    const end = color === 'black' ? 31 : 15;
    for (let i = start; i <= end; i++) {
        if (pieces[i].inDanger) {
            for (let pos of pieces[i].inDanger) {
                if (pos === piecee && pieces[i].dead === false) {
                    return true;
                };
            }
        }
    };
    return false;
}

function findProtection (piecee, data, color) {
    const start = color === 'black' ? 0 : 16;
    const end = color === 'black' ? 15 : 31;
    const pieces = data.piecePositions;
    for (let i = start; i <= end; i++) {
        if (pieces[i].inDanger) {
            for (let pos of pieces[i].inDanger) {
                if (pos === piecee && pieces[i].dead === false) {
                    return true;
                }
            }
        }
    }

    return false;
}

function dangerPawn (data, numberPos, number, piece, alphabet, positions, index, simulate) {
    let extremePieceBlack = false;
    let extremePieceWhite = false;

    if (data.player === 'black') {
        extremePieceBlack = numberPos === 1 ? true : false;
    } else {
        extremePieceWhite = numberPos === 8 ? true : false;
    };

    const isExtreme = data.player === 'black' ? extremePieceBlack : extremePieceWhite;

    if (!isExtreme) {
        const indexLetter = alphabet.indexOf(piece.in[0]);
        const letterRight = alphabet[indexLetter - 1];
        const letterLeft = alphabet[indexLetter + 1];
        let numberRight = 0;
        if (number === 7) {
            numberRight = numberPos - 1;
        } else if (number === 2) {
            numberRight = numberPos + 1;
        };

        const diaRight = `${letterRight}${numberRight}`;
        const diaLeft = `${letterLeft}${numberRight}`;
        const piece1 = positions.find((element) => element.name === 'k' && element.in === diaRight && element.color !== piece.color);
        const piece2 = positions.find((element) => element.name === 'k' && element.in === diaLeft && element.color !== piece.color);
        if ((piece1 || piece2) && !data.checkmate) {
            if (simulate === false) {
                const color = piece.color === 'black' ? 'white' : 'black';
                const piecee = piece1 ? diaRight : diaLeft;
                data.setCheckmate({color, piece: piecee, pieceCheck: data.onPiece.piece});
                valideCheckmate(data, color);
            }
        };

        positions[index].inDanger = [diaLeft, diaRight];
    }
}

function dangerRook (data, positions, index, letter, numberPiece, alphabet, queen, piece, simulate) {
    const posDangers = [];
    const king = piece.color === 'white' ? 'e8' : 'e1';
    const color = piece.color === 'black' ? 'white' : 'black';

    for (let i = numberPiece - 1; i > 0; i --) {
        const codePosition = `${letter}${i}`;
        const position = data.positionsFrames.find((element) => element.frame === codePosition);
        const pieceFront = positions.find((element) => element.in === codePosition && element.dead === false);
        if (pieceFront) {
            if (queen) {
                queen.push(pieceFront.in);
            } else {
                posDangers.push(pieceFront.in);
            };
            if (pieceFront.piece === king) {
                if (simulate === false && !data.checkmate) {
                    data.setCheckmate({color, piece: pieceFront.in, pieceCheck: data.onPiece.piece});
                    valideCheckmate(data, color);
                }
                continue;
            } else {
                break;
            };
        };
        if (queen) {
            queen.push(position.frame);
        } else {
            posDangers.push(position.frame);
        }
    };
    for (let i = numberPiece + 1; i <= 8; i++) {
        const codePosition = `${letter}${i}`;
        const position = data.positionsFrames.find((element) => element.frame === codePosition);
        const pieceBack = positions.find((element) => element.in === codePosition && element.dead === false);
        if (pieceBack) {
            if (queen) {
                queen.push(pieceBack.in);
            } else {
                posDangers.push(pieceBack.in);
            };
            if (pieceBack.piece === king) {
                if (simulate === false && !data.checkmate) {
                    data.setCheckmate({color, piece: pieceBack.in, pieceCheck: data.onPiece.piece});
                    valideCheckmate(data, color);
                };
                continue;
            } else {
                break;
            }
        };
        if (queen) {
            queen.push(position.frame);
        } else {
            posDangers.push(position.frame);
        }
    };

    const indexLetter = alphabet.indexOf(letter);
    for (let i = indexLetter - 1; i >= 0; i--) {
        const codePosition = `${alphabet[i]}${numberPiece}`;
        const position = data.positionsFrames.find((element) => element.frame === codePosition);
        const pieceRight = positions.find((element) => element.in === codePosition && element.dead === false);
        if (pieceRight) {
            if (queen) {
                queen.push(pieceRight.in);
            } else {
                posDangers.push(pieceRight.in);
            }
            if (pieceRight.piece === king) {
                if (simulate === false && !data.checkmate) {
                    data.setCheckmate({color, piece: pieceRight.in, pieceCheck: data.onPiece.piece});
                    valideCheckmate(data, color);
                };
                continue;
            } else {
                break;
            }
        };
        if (queen) {
            queen.push(position.frame);
        } else {
            posDangers.push(position.frame);
        }
    };

    for (let i = indexLetter + 1; i < 8; i++){
        const codePosition = `${alphabet[i]}${numberPiece}`;
        const position = data.positionsFrames.find((element) => element.frame === codePosition);
        const pieceLeft = positions.find((element) => element.in === codePosition && element.dead === false);
        if (pieceLeft) {
            if (queen) {
                queen.push(pieceLeft.in);
            } else {
                posDangers.push(pieceLeft.in)
            };
            if (pieceLeft.piece === king) {
                if (simulate === false && !data.checkmate) {
                    data.setCheckmate({color, piece: pieceLeft.in, pieceCheck: data.onPiece.piece});
                    valideCheckmate(data, color);
                };
                continue;
            } else {
                break;
            }
        };
        if (queen) {
            queen.push(position.frame);
        } else {
            posDangers.push(position.frame);
        }   
    }

    if (!queen) {
        positions[index].inDanger = posDangers;
    };
}

function dangerHorse (data, alphabet, indexLetter, numberPiece, indexPiece, positions, piece, simulate) {
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
    const dangerPos = [];
    const king = piece.color === 'white' ?  data.piecePositions[4] : data.piecePositions[20];
    const color = piece.color === 'black' ? 'white' : 'black';

    if (pos1) {
        dangerPos.push(pos1.frame);
        if (king.in === pos1.frame && !data.checkmate && simulate === false) {
            data.setCheckmate({color, piece: king.in, pieceCheck: data.onPiece.piece});
            valideCheckmate(data, color);
        }
    };
    if (pos2) {
        dangerPos.push(pos2.frame);
        if (king.in === pos2.frame && !data.checkmate && simulate === false) {
            data.setCheckmate({color, piece: king.in, pieceCheck: data.onPiece.piece});
            valideCheckmate(data, color);
        }
    };
    if (pos3) {
        dangerPos.push(pos3.frame);
        if (king.in === pos3.frame && !data.checkmate && simulate === false) {
            data.setCheckmate({color, piece: king.in, pieceCheck: data.onPiece.piece});
            valideCheckmate(data, color);
        }
    };
    if (pos4) {
        dangerPos.push(pos4.frame);
        if (king.in === pos4.frame && !data.checkmate && simulate === false) {
            data.setCheckmate({color, piece: king.in, pieceCheck: data.onPiece.piece});
            valideCheckmate(data, color);
        }
    };
    if (pos5) {
        dangerPos.push(pos5.frame);
        if (king.in === pos5.frame && !data.checkmate && simulate === false) {
            data.setCheckmate({color, piece: king.in, pieceCheck: data.onPiece.piece});
            valideCheckmate(data, color);
        }
    };
    if (pos6) {
        dangerPos.push(pos6.frame);
        if (king.in === pos6.frame && !data.checkmate && simulate === false) {
            data.setCheckmate({color, piece: king.in, pieceCheck: data.onPiece.piece});
            valideCheckmate(data, color);
        }
    };
    if (pos7) {
        dangerPos.push(pos7.frame);
        if (king.in === pos7.frame && !data.checkmate && simulate === false) {
            data.setCheckmate({color, piece: king.in, pieceCheck: data.onPiece.piece});
            valideCheckmate(data, color);
        }
    };
    if (pos8) {
        dangerPos.push(pos8.frame);
        if (king.in === pos8.frame && !data.checkmate && simulate === false) {
            data.setCheckmate({color, piece: king.in, pieceCheck: data.onPiece.piece});
            valideCheckmate(data, color);
        }
    };

    positions[indexPiece].inDanger = dangerPos;
}

function dangerBishop (data, numberPiece, alphabet, indexLetter, positions, indexPiece, queen, piece, simulate) {
    let j = numberPiece - 1;
    let b = indexLetter - 1; 
    let c = indexLetter - 1; 
    const dangerPos = [];
    const king = piece.color === 'white' ? 'e8' : 'e1';
    const color = piece.color === 'black' ? 'white' : 'black';


    for (let i = indexLetter + 1; i < 8; i++) {
        const codePosition = `${alphabet[i]}${j}`;
        const piecePosition = data.positionsFrames.find((element) => element.frame === codePosition);
        const pieceFront = positions.find((element) => element.in === codePosition && element.dead === false);
        j -= 1;
        if (pieceFront) {
            if (queen) {
                queen.push(pieceFront.in);
            } else {
                dangerPos.push(pieceFront.in);
            };
            if (pieceFront.piece === king) {
                if (simulate === false && !data.checkmate) {
                    data.setCheckmate({color, piece: pieceFront.in, pieceCheck: data.onPiece.piece});
                    valideCheckmate(data, color);
                };
                continue;
            } else {
                break;
            }
        };

        if (piecePosition) {
            if (queen) {
                queen.push(piecePosition.frame);
            } else {
                dangerPos.push(piecePosition.frame);
            };
        };
    };

    for (let i = numberPiece + 1; i <= 8; i++) {
        const codePosition = `${alphabet[b]}${i}`;
        const pos = data.positionsFrames.find((element) => element.frame === codePosition);
        const pieceBack = positions.find((element) => element.in === codePosition && element.dead === false);
        b -= 1;
        if (pieceBack) {
            if (queen) {
                queen.push(pieceBack.in);
            } else {
                dangerPos.push(pieceBack.in);
            };
            if (pieceBack.piece === king) {
                if (simulate === false && !data.checkmate) {
                    data.setCheckmate({color, piece: pieceBack.in, pieceCheck: data.onPiece.piece});
                    valideCheckmate(data, color);
                };
                continue;
            } else {
                break;
            };
        };

        if (pos) {
            if (queen) {
                queen.push(pos.frame);
            } else {
                dangerPos.push(pos.frame);
            }
        };
    };
    for (let i = numberPiece - 1; i > 0; i--) {
        const codePosition = `${alphabet[c]}${i}`;
        const pos = data.positionsFrames.find((element) => element.frame === codePosition);
        const pieceFront = positions.find((element) => element.in === codePosition && element.dead === false);
        c -= 1;
        if (pieceFront) {
            if (queen) {
                queen.push(pieceFront.in);
            } else {
                dangerPos.push(pieceFront.in);
            };
            if (pieceFront.piece === king) {
                if (simulate === false && !data.checkmate) {
                    data.setCheckmate({color, piece: pieceFront.in, pieceCheck: data.onPiece.piece});
                    valideCheckmate(data, color);
                };
                continue;
            } else {
                break;
            };
        };

        if (pos) {
            if (queen) {
                queen.push(pos.frame);
            } else {
                dangerPos.push(pos.frame);
            }
        };
    };
    let z = numberPiece + 1;
    for (let i = indexLetter + 1; i < 8; i++) {
        const codePosition = `${alphabet[i]}${z}`;
        const pos = data.positionsFrames.find((element) => element.frame === codePosition);
        const pieceBack = positions.find((element) => element.in === codePosition && element.dead === false);
        z += 1;
        if (pieceBack) {
            if (queen) {
                queen.push(pieceBack.in);
            } else {
                dangerPos.push(pieceBack.in);
            };
            if (pieceBack.piece === king) {
                if (simulate === false && !data.checkmate) {
                    data.setCheckmate({color, piece: pieceBack.in, pieceCheck: data.onPiece.piece});
                    valideCheckmate(data, color);
                };
                continue;
            } else {
                break;
            }
        };

        if (pos) {
            if (queen) {
                queen.push(pos.frame);
            } else {
                dangerPos.push(pos.frame);
            }
        };
    }
    
    if (!queen) {
        positions[indexPiece].inDanger = dangerPos;
    };
}

function dangerQueen (data, numberPiece, alphabet, indexLetter, positions, indexPiece, letter, piece, simulate) {
    let dangerPos = [];
    dangerBishop(data, numberPiece, alphabet, indexLetter, positions, indexPiece, dangerPos, piece, simulate);
    dangerRook(data, positions, indexPiece, letter, numberPiece, alphabet, dangerPos, piece, simulate);
    positions[indexPiece].inDanger = dangerPos;
}


function dangers (data, pieces, set, simulate) {
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const arrayPieces = pieces;
    for (let piece of arrayPieces) {
        const numberPos = parseInt(piece.in[1]);
        const number = parseInt(piece.piece[1]);
        const letterPiece = piece.in[0];
        const indexLetter = alphabet.indexOf(letterPiece);
        const indexPiece = arrayPieces.indexOf(piece);
        if (piece.dead === false) {
            switch (piece.name) {
                case 'p':
                    dangerPawn(data, numberPos, number, piece, alphabet, arrayPieces, indexPiece, simulate);
                    break;
                case 'r':
                    dangerRook(data, arrayPieces, indexPiece, letterPiece, numberPos, alphabet, false, piece, simulate);
                    break;
                case 'h':
                    dangerHorse(data, alphabet, indexLetter, numberPos, indexPiece, arrayPieces, piece, simulate);
                    break;
                case 'b': 
                    dangerBishop(data, numberPos, alphabet, indexLetter, arrayPieces, indexPiece, false, piece, simulate);
                    break;
                case 'q':
                    dangerQueen(data, numberPos, alphabet, indexLetter, arrayPieces, indexPiece, letterPiece, piece, simulate);
                    break;
                default:
                    break;
            };
        }
    };
    if (set) {
        data.setPiecePositions(arrayPieces);
    } else {
        return arrayPieces;
    };
}

function pawnMoves (data, numberPos, position, alphabet, number, numberPiece, numberPiecesPlayer, components) {
    let frame1 = '';
    let frame2 = '';
    const letterPos = position.in[0];
    const indexLetter = alphabet.indexOf(position.in[0]);
    const letterRight = alphabet[indexLetter - 1];
    const letterLeft = alphabet[indexLetter + 1];
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
    const pieceDiaR = data.piecePositions.find((element) => element.in === diaRight && element.dead === false);
    const numberPieceDiaR = pieceDiaR ? parseInt(pieceDiaR.piece[1]) : null;
    const pieceDiaL = data.piecePositions.find((element) => element.in === diaLeft && element.dead === false);
    const numberPieceDiaL = pieceDiaL ? parseInt(pieceDiaL.piece[1]) : null;
    const pieceFrontPos = data.piecePositions.find((element) => element.in === pieceFront && element.dead === false);
    const king = data.player === 'white' ? data.piecePositions[20] : data.piecePositions[4];

    if (pieceDiaR && !numberPiecesPlayer.includes(numberPieceDiaR)) {
        if (data.checkmate && data.checkmate.color === data.player) {
            if (simulateKill(position, pieceDiaR, data) === false) {
                const x = pieceDiaR.position[0] - 0.25;
                const y = pieceDiaR.position[1] - 1;
                const z = numberPiece === 1 || numberPiece === 2 ? pieceDiaR.position[2] + 0.25 : pieceDiaR.position[2] - 0.25;
                components.push(<BoxEnemy key={2222} position={[x, y, z]} pieceKill={pieceDiaR} piece={data.onPiece}/>);
            }
        } else {
            if (simulateKill2(position, pieceDiaR, data, king.in) === false) {
                const x = pieceDiaR.position[0] - 0.25;
                const y = pieceDiaR.position[1] - 1;
                const z = numberPiece === 1 || numberPiece === 2 ? pieceDiaR.position[2] + 0.25 : pieceDiaR.position[2] - 0.25;
                components.push(<BoxEnemy key={2222} position={[x, y, z]} pieceKill={pieceDiaR} piece={data.onPiece}/>);
            }
        }
    };

    if (pieceDiaL && !numberPiecesPlayer.includes(numberPieceDiaL)) {
        if (data.checkmate && data.checkmate.color === data.player) {
            if (simulateKill(position, pieceDiaL, data) === false) {
                const x = pieceDiaL.position[0] - 0.25;
                const y = pieceDiaL.position[1] - 1;
                const z = numberPiece === 1 || numberPiece === 2 ? pieceDiaL.position[2] + 0.25 : pieceDiaL.position[2] - 0.25;
                components.push(<BoxEnemy key={333} position={[x, y, z]} pieceKill={pieceDiaL} piece={data.onPiece}/>);
            }
        } else {
            if (simulateKill2(position, pieceDiaL, data, king.in) === false) {
                const x = pieceDiaL.position[0] - 0.25;
                const y = pieceDiaL.position[1] - 1;
                const z = numberPiece === 1 || numberPiece === 2 ? pieceDiaL.position[2] + 0.25 : pieceDiaL.position[2] - 0.25;
                components.push(<BoxEnemy key={333} position={[x, y, z]} pieceKill={pieceDiaL} piece={data.onPiece}/>);
            }
        }
    };
    if (position.piece === position.in && !pieceFrontPos) {
        if (data.checkmate && data.checkmate.color === data.player) {
            if (simulateMove(data, position, pos1.position, data.checkmate.piece) === false) {
                components.push(<CircleMove key={2} position={pos1.position} piece={data.onPiece}/>); 
            };
            if (simulateMove(data, position, pos2.position, data.checkmate.piece) === false) {
                components.push(<CircleMove key={3} position={pos2.position} piece={data.onPiece}/>);
            };
        } else {
            if (simulateMove2(data, position, pos1.position, king.in, king.color) === false) {
                components.push(<CircleMove key={2} position={pos1.position} piece={data.onPiece}/>);
            };

            if (simulateMove2(data, position, pos2.position, king.in, king.color) === false) {
                components.push(<CircleMove key={3} position={pos2.position} piece={data.onPiece}/>);
            }
        }
    } else if (!pieceFrontPos){
        if (data.checkmate && data.checkmate.color === data.player) {
            if (simulateMove(data, position, pos1.position, data.checkmate.piece) === false) {
                components.push(<CircleMove key={2} position={pos1.position} piece={data.onPiece}/>);
            }
        } else {
            if (simulateMove2(data, position, pos1.position, king.in, king.color) === false) {
                components.push(<CircleMove key={2} position={pos1.position} piece={data.onPiece}/>);
            };
        }
    };
}

function rookMoves(piece, data, numberPiece, components, alphabet) {
    const letterPiece = piece.in[0];
    for (let i = numberPiece - 1; i > 0; i --) {
        const codePosition = `${letterPiece}${i}`;
        const position = data.positionsFrames.find((element) => element.frame === codePosition);
        const pieceFront = data.piecePositions.find((element) => element.in === codePosition && element.dead === false);
        
        if (pieceFront) {
            checkmateKill(data, components, piece, pieceFront, i + 300);
            break;
        };
        checkmateValue(data, components, piece, position, i + 10);
    };
    for (let i = numberPiece + 1; i <= 8; i++) {
        const codePosition = `${letterPiece}${i}`;
        const position = data.positionsFrames.find((element) => element.frame === codePosition);
        const pieceBack = data.piecePositions.find((element) => element.in === codePosition && element.dead === false);
        if (pieceBack) {
            checkmateKill(data, components, piece, pieceBack, i + 300);
            break;
        };
        checkmateValue(data, components, piece, position, i - 20);
    };

    const indexLetter = alphabet.indexOf(letterPiece);
    for (let i = indexLetter - 1; i >= 0; i--) {
        const codePosition = `${alphabet[i]}${numberPiece}`;
        const position = data.positionsFrames.find((element) => element.frame === codePosition);
        const pieceRight = data.piecePositions.find((element) => element.in === codePosition && element.dead === false);
        if (pieceRight) {
            checkmateKill(data, components, piece, pieceRight, i - 34);
            break;
        };
        checkmateValue(data, components, piece, position, i - 55);
    };

    for (let i = indexLetter + 1; i < 8; i++){
        const codePosition = `${alphabet[i]}${numberPiece}`;
        const position = data.positionsFrames.find((element) => element.frame === codePosition);
        const pieceLeft = data.piecePositions.find((element) => element.in === codePosition && element.dead === false);
        if (pieceLeft) {
            checkmateKill(data, components, piece, pieceLeft, i + 432);
            break;
        };
        checkmateValue(data, components, piece, position, i - 12);
    }
};

function horseMoves(position, alphabet, numberPiece, data, components) {
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
    const piece1 = data.piecePositions.find((element) => element.in === code1 && element.dead === false);
    const piece2 = data.piecePositions.find((element) => element.in === code2 && element.dead === false);
    const piece3 = data.piecePositions.find((element) => element.in === code3 && element.dead === false);
    const piece4 = data.piecePositions.find((element) => element.in === code4 && element.dead === false);
    const piece5 = data.piecePositions.find((element) => element.in === code5 && element.dead === false);
    const piece6 = data.piecePositions.find((element) => element.in === code6 && element.dead === false);
    const piece7 = data.piecePositions.find((element) => element.in === code7 && element.dead === false);
    const piece8 = data.piecePositions.find((element) => element.in === code8 && element.dead === false);

    if (pos1 && !piece1) {
        checkmateValue(data, components, position, pos1, 9882);
    } else if (pos1 && piece1) {
        checkmateKill(data, components, position, piece1, 728724);
    }
    if (pos2 && !piece2) {
        checkmateValue(data, components, position, pos2, 92891);
    } else if (pos2 && piece2) {
        checkmateKill(data, components, position, piece2, 97662);
    };
    if (pos3 && !piece3) {
        checkmateValue(data, components, position, pos3, 123643);
    } else if (pos3 && piece3) {
        checkmateKill(data, components, position, piece3, 12314);
    };
    if (pos4 && !piece4) {
        checkmateValue(data, components, position, pos4, 1254);
    } else if (pos4 && piece4) {
        checkmateKill(data, components, position, piece4, 12353);
    };
    if (pos5 && !piece5) {
        checkmateValue(data, components, position, pos5, 81724);
    } else if (pos5 && piece5) {
        checkmateKill(data, components, position, piece5, 87875);
    };
    if (pos6 && !piece6) {
        checkmateValue(data, components, position, pos6, 11293);
    } else if (pos6 && piece6) {
        checkmateKill(data, components, position, piece6, 883283);
    };
    if (pos7 && !piece7) {
        checkmateValue(data, components, position, pos7, 89772);
    } else if (pos7 && piece7) {
       checkmateKill(data, components, position, piece7, 87632);
    };
    if (pos8 && !piece8) {
        checkmateValue(data, components, position, pos8, 98762);
    } else if (pos8 && piece8){
        checkmateKill(data, components, position, piece8, 71872);
    };
}

function bishopMoves(numberPiece, alphabet, data, components) {
    let j = numberPiece - 1;
    const piece = data.piecePositions.find((elemet) => elemet.piece === data.onPiece.piece);
    let letter = piece.in[0];
    const indexLetter = alphabet.indexOf(letter);
    let b = indexLetter - 1; 
    let c = indexLetter - 1; 

    for (let i = indexLetter + 1; i < 8; i++) {
        const codePosition = `${alphabet[i]}${j}`;
        const piecePosition = data.positionsFrames.find((element) => element.frame === codePosition);
        const pieceFront = data.piecePositions.find((element) => element.in === codePosition && element.dead === false);
        if (pieceFront) {
            checkmateKill(data, components, piece, pieceFront, `${i}${i}1`);
            break;
        };

        if (piecePosition) {
            checkmateValue(data, components, piece, piecePosition, `${piecePosition}${i}`);
        };

        j -= 1;
    };

    for (let i = numberPiece + 1; i <= 8; i++) {
        const codePosition = `${alphabet[b]}${i}`;
        const pos = data.positionsFrames.find((element) => element.frame === codePosition);
        const pieceBack = data.piecePositions.find((element) => element.in === codePosition && element.dead === false);
        if (pieceBack) {
            checkmateKill(data, components, piece, pieceBack);
            break;
        };

        if (pos) {
            checkmateValue(data, components, piece, pos, `${i}${b}3`)
        };

        b -= 1;
    };

    for (let i = numberPiece - 1; i > 0; i--) {
        const codePosition = `${alphabet[c]}${i}`;
        const pos = data.positionsFrames.find((element) => element.frame === codePosition);
        const pieceFront = data.piecePositions.find((element) => element.in === codePosition && element.dead === false);
        if (pieceFront) {
            checkmateKill(data, components, piece, pieceFront, `${c}${i}5`);
            break;
        };

        if (pos) {
            checkmateValue(data, components, piece, pos, `${i}${c}${6}`);
        };

        c -= 1;
    };
    let z = numberPiece + 1;
    for (let i = indexLetter + 1; i < 8; i++) {
        const codePosition = `${alphabet[i]}${z}`;
        const pos = data.positionsFrames.find((element) => element.frame === codePosition);
        const pieceBack = data.piecePositions.find((element) => element.in === codePosition && element.dead === false);
        if (pieceBack) {
            checkmateKill(data, components, piece, pieceBack, `${z}${i}7`);
            break;
        };

        if (pos) {
            checkmateValue(data, components, piece, pos, `${i}${z}8`);
        };

        z += 1;

    }
}

function queenMoves (data, alphabet, numberPiece, components, position) {
    bishopMoves(numberPiece, alphabet, data, components);
    rookMoves(position, data, numberPiece, components, alphabet);
}

function kingMoves (data, alphabet, numberPiece, components, piece) {
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
    const piece1 = data.piecePositions.find((element) => element.in === code1 && element.dead === false);
    const piece2 = data.piecePositions.find((element) => element.in === code2 && element.dead === false);
    const piece3 = data.piecePositions.find((element) => element.in === code3 && element.dead === false);
    const piece4 = data.piecePositions.find((element) => element.in === code4 && element.dead === false);
    const piece5 = data.piecePositions.find((element) => element.in === code5 && element.dead === false);
    const piece6 = data.piecePositions.find((element) => element.in === code6 && element.dead === false);
    const piece7 = data.piecePositions.find((element) => element.in === code7 && element.dead === false);
    const piece8 = data.piecePositions.find((element) => element.in === code8 && element.dead === false);
    if (piece.move === false) {
        const posLeft = `${alphabet[indexLetter + 2]}${numberPiece}`;
        const posRook = `${alphabet[indexLetter + 3]}${numberPiece}`;
        const piece9 = data.piecePositions.find((element) => element.in === posLeft && element.dead === false);
        const piece10 = data.piecePositions.find((element) => element.in === posRook && element.dead === false && piece.color === element.color && element.name === 'r');
        const danger4 = findDanger(code4, piece.color, data.piecePositions);
        const dangerLeft = findDanger(posLeft, piece.color, data.piecePositions);
        const dangerRook = piece10 ? findDanger(posRook, piece10.color, data.piecePositions) : true;

        if (!piece4 && !piece9 && piece10 && piece10.move === false && !data.chekcmate && danger4 === false && dangerLeft === false && dangerRook === false) {
            const positionLeftKing = data.positionsFrames.find((element) => element.frame === posLeft);
            const dataCastling = {king: piece, rook: piece10, posKing: posLeft, posRook: code4};
            components.push(<CircleMove key={`${posLeft}15`} position={positionLeftKing.position} piece={data.onPiece} castling={dataCastling}/>);
        };

        const posp1 = code3;
        const posp2 = `${alphabet[indexLetter - 2]}${numberPiece}`;
        const posp3 = `${alphabet[indexLetter - 3]}${numberPiece}`;
        const pospRook = `${alphabet[indexLetter - 4]}${numberPiece}`;
        const piecep2 = data.piecePositions.find((element) => element.in === posp2 && element.dead === false);
        const piecep3 = data.piecePositions.find((element) => element.in === posp3 && element.dead === false);
        const piecepRook = data.piecePositions.find((element) => element.in === pospRook && element.dead === false && piece.color === element.color && element.name === 'r');
        const dangerp1 = findDanger(posp1, piece.color, data.piecePositions);
        const dangerp2 = findDanger(posp2, piece.color, data.piecePositions);
        const dangerp3 = findDanger(posp3, piece.color, data.piecePositions);
        const dangerpRook = piecepRook ? findDanger(pospRook, piece.color, data.piecePositions) : true;
        if (!piece3 && !piecep2 && !piecep3 && piecepRook && piecepRook.move === false && !data.chekcmate && dangerp1 === false && dangerp2 === false && dangerp3 === false && dangerpRook === false) {
            const positionKingMove = data.positionsFrames.find((element) => element.frame === posp2);
            const dataCastling = {king: piece, rook: piecepRook, posKing: posp2, posRook: posp1};
            components.push(<CircleMove key={`${posp3}15`} position={positionKingMove.position} piece={data.onPiece} castling={dataCastling} />);
        }
    }
    if (pos1 && !piece1) {
        if (findDanger(pos1.frame, piece.color, data.piecePositions) === false) {
            components.push(<CircleMove key={`${pos1.frame}13`} position={pos1.position} piece={data.onPiece}/>);
        }
    } else if (piece1) {
        if (piece.color !== piece1.color && findProtection(piece1.in, data, piece1.color) === false) {
            const x = piece1.position[0] - 0.25;
            const y = piece1.position[1] - 1;
            const z = piece1.position[2] - 0.25;
            components.push(<BoxEnemy key={`${piece1.piece}14`} position={[x, y, z]} pieceKill={piece1} piece={data.onPiece}/>);
        }
    };

    if (pos2 && !piece2) {
        if (findDanger(pos2.frame, piece.color, data.piecePositions) === false) {
            components.push(<CircleMove key={`${pos2.frame}13`} position={pos2.position} piece={data.onPiece}/>);
        }
    } else if (piece2) {
        if (piece.color !== piece2.color && findProtection(piece2.in, data, piece2.color) === false) {
            const x = piece2.position[0] - 0.25;
            const y = piece2.position[1] - 1;
            const z = piece2.position[2] - 0.25;
            components.push(<BoxEnemy key={`${piece2.piece}14`} position={[x, y, z]} pieceKill={piece2} piece={data.onPiece}/>);
        }
    };

    if (pos3 && !piece3) {
        if (findDanger(pos3.frame, piece.color, data.piecePositions) === false) {
            components.push(<CircleMove key={`${pos3.frame}13`} position={pos3.position} piece={data.onPiece}/>);
        }
    } else if (piece3) {
        if (piece.color !== piece3.color && findProtection(piece3.in, data, piece3.color) === false) {
            const x = piece3.position[0] - 0.25;
            const y = piece3.position[1] - 1;
            const z = piece3.position[2] - 0.25;
            components.push(<BoxEnemy key={`${piece3.piece}14`} position={[x, y, z]} pieceKill={piece3} piece={data.onPiece}/>);
        }
    };

    if (pos4 && !piece4) {
        if (findDanger(pos4.frame, piece.color, data.piecePositions) === false) {
            components.push(<CircleMove key={`${pos4.frame}13`} position={pos4.position} piece={data.onPiece}/>);
        }
    } else if (piece4) {
        if (piece.color !== piece4.color && findProtection(piece4.in, data, piece4.color) === false) {
            const x = piece4.position[0] - 0.25;
            const y = piece4.position[1] - 1;
            const z = piece4.position[2] - 0.25;
            components.push(<BoxEnemy key={`${piece4.piece}14`} position={[x, y, z]} pieceKill={piece4} piece={data.onPiece}/>);
        }
    };

    if (pos5 && !piece5) {
        if (findDanger(pos5.frame, piece.color, data.piecePositions) === false) {
            components.push(<CircleMove key={`${pos5.frame}13`} position={pos5.position} piece={data.onPiece}/>);
        }
    } else if (piece5) {
        if (piece.color !== piece5.color && findProtection(piece5.in, data, piece5.color) === false) {
            const x = piece5.position[0] - 0.25;
            const y = piece5.position[1] - 1;
            const z = piece5.position[2] - 0.25;
            components.push(<BoxEnemy key={`${piece5.piece}14`} position={[x, y, z]} pieceKill={piece5} piece={data.onPiece}/>);
        }
    };

    if (pos6 && !piece6) {
        if (findDanger(pos6.frame, piece.color, data.piecePositions) === false) {
            components.push(<CircleMove key={`${pos6.frame}13`} position={pos6.position} piece={data.onPiece}/>);
        }
    } else if (piece6) {
        if (piece.color !== piece6.color && findProtection(piece6.in, data, piece6.color) === false) {
            const x = piece6.position[0] - 0.25;
            const y = piece6.position[1] - 1;
            const z = piece6.position[2] - 0.25;
            components.push(<BoxEnemy key={`${piece6.piece}14`} position={[x, y, z]} pieceKill={piece6} piece={data.onPiece}/>);
        }
    };

    if (pos7 && !piece7) {
        if (findDanger(pos7.frame, piece.color, data.piecePositions) === false) {
            components.push(<CircleMove key={`${pos7.frame}13`} position={pos7.position} piece={data.onPiece}/>);
        }
    } else if (piece7) {
        if (piece.color !== piece7.color && findProtection(piece7.in, data, piece7.color) === false) {
            const x = piece7.position[0] - 0.25;
            const y = piece7.position[1] - 1;
            const z = piece7.position[2] - 0.25;
            components.push(<BoxEnemy key={`${piece7.piece}14`} position={[x, y, z]} pieceKill={piece7} piece={data.onPiece}/>);
        }
    };

    if (pos8 && !piece8) {
        if (findDanger(pos8.frame, piece.color, data.piecePositions) === false) {
            components.push(<CircleMove key={`${pos8.frame}13`} position={pos8.position} piece={data.onPiece}/>);
        }
    } else if (piece8) {
        if (piece.color !== piece8.color && findProtection(piece8.in, data, piece8.color) === false) {
            const x = piece8.position[0] - 0.25;
            const y = piece8.position[1] - 1;
            const z = piece8.position[2] - 0.25;
            components.push(<BoxEnemy key={`${piece8.piece}14`} position={[x, y, z]} pieceKill={piece8} piece={data.onPiece}/>);
        }
    };
}

function renderBoxs (data) {
    const boxs = [];

    let x = 43.75;
    let z = 43.75;
    let patron = false;

    const positions = [];

    for (let i = 0; i < 64; i++) {
        const lightColor = true;
        const darkColor = false;
        let color = lightColor;
        if (patron) {
            color = i % 2 === 0 ? darkColor : lightColor;
        } else {
            color = i % 2 === 0 ? lightColor : darkColor;
        }

        boxs.push(
            <Frame key={i} args={[12.5, 10, 12.5]} color={color} position={[x, 1, z]}/>
        );
        
        positions.push({
            position: [x + 0.25, 6, z + 0.25]
        });

        x -= 12.5;

        if ((i + 1) % 8 === 0) {
            z -= 12.5;
            x = 43.75;
            patron = !patron;
        }
    };
    const rook1 = data.piecePositions[0].dead === false ? <RookModel key='a8' color='black' position={data.piecePositions[0].position} name='a8'/> : null;
    const horse1 = data.piecePositions[1].dead === false ? <HorseModel key='b8' color='black' position={data.piecePositions[1].position} name='b8'/> : null;
    const bishop1 = data.piecePositions[2].dead === false ? <BishopModel key='c8' color='black' position={data.piecePositions[2].position} name='c8'/> : null;
    const queen1 = data.piecePositions[3].dead === false ? <QueenModel key='d8' color='black' position={data.piecePositions[3].position} name='d8'/> : null;
    const king1 = data.piecePositions[4].dead === false ? <KingModel key='e8' color='black' position={data.piecePositions[4].position} name='e8'/> : null;
    const bishop12 = data.piecePositions[5].dead === false ?  <BishopModel key='f8' color='black' position={data.piecePositions[5].position} name='f8'/> : null;
    const horse12 = data.piecePositions[6].dead === false ? <HorseModel key='g8' color='black' position={data.piecePositions[6].position} name='g8'/> : null;
    const rook12 = data.piecePositions[7].dead === false ? <RookModel key='h8' color='black' position={data.piecePositions[7].position} name='h8'/> : null;
    boxs.push(rook1, horse1, bishop1, queen1, king1, bishop12, horse12, rook12);

    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    for (let i = 0; i < 8; i++) {
        const name = `${alphabet[i]}7`;
        const piece = data.piecePositions[i + 8];
        if (piece.dead === false) {
            if (piece.prom !== false) {
                switch (piece.prom) {
                    case 1: 
                        boxs.push(<QueenModel key={name} color='black' position={piece.position} name={name}/>);
                        break;
                    case 2: 
                        boxs.push(<RookModel key={name} color='black' position={piece.position} name={name}/>);
                        break;
                    case 3: 
                        boxs.push(<HorseModel key={name} color='black' position={piece.position} name={name}/>);
                        break;
                    case 4: 
                        boxs.push(<BishopModel key={name} color='black' position={piece.position} name={name}/>);
                        break;
                    default: 
                        boxs.push(<QueenModel key={name} color='black' position={piece.position} name={name}/>);
                        break;
                }
            } else {
                boxs.push(<PawnModel key={name} color='black' position={piece.position} name={name}/>);
            }
        };
    };
    const rook2 = data.piecePositions[16].dead === false ? <RookModel key='a1' color='white' position={data.piecePositions[16].position} name='a1'/> : null;
    const horse2 = data.piecePositions[17].dead === false ? <HorseModel key='b1' color='white' position={data.piecePositions[17].position} name='b1'/> : null;
    const bishop2 = data.piecePositions[18].dead === false ? <BishopModel key='c1' color='white' position={data.piecePositions[18].position} name='c1'/> : null;
    const queen2 = data.piecePositions[19].dead === false ? <QueenModel key='d1' color='white' position={data.piecePositions[19].position} name='d1'/> : null;
    const king2 = data.piecePositions[20].dead === false ?  <KingModel key='e1' color='white' position={data.piecePositions[20].position} name='e1'/> : null;
    const bishop21 = data.piecePositions[21].dead === false ? <BishopModel key='f1' color='white' position={data.piecePositions[21].position} name='f1'/> : null;
    const horse21 = data.piecePositions[22].dead === false ? <HorseModel key='g1' color='white' position={data.piecePositions[22].position} name='g1'/> : null;
    const rook21 = data.piecePositions[23].dead === false ? <RookModel key='h1' color='white' position={data.piecePositions[23].position} name='h1'/> : null;

    boxs.push(rook2, horse2, bishop2, queen2, king2, bishop21, horse21, rook21);

    
    for (let i = 0; i < 8; i++) {
        const name = `${alphabet[i]}2`;
        const piece = data.piecePositions[i + 24];
        if (piece.dead === false) {
            if (piece.prom !== false) {
                switch (piece.prom) {
                    case 1: 
                        boxs.push(<QueenModel key={name} color='white' position={piece.position} name={name}/>);
                        break;
                    case 2: 
                        boxs.push(<RookModel key={name} color='white' position={piece.position} name={name}/>);
                        break;
                    case 3: 
                        boxs.push(<HorseModel key={name} color='white' position={piece.position} name={name}/>);
                        break;
                    case 4: 
                        boxs.push(<BishopModel key={name} color='white' position={piece.position} name={name}/>);
                        break;
                    default: 
                        boxs.push(<QueenModel key={name} color='white' position={piece.position} name={name}/>);
                        break;
                }
            } else {
                boxs.push(<PawnModel key={name} color='white' position={piece.position} name={name}/>);
            }
        }
    };


    return boxs;
}

function selectedPiece (data, dataGame) {
    const components = [];
    const numberPiecesPlayer = data.player === 'black' ? [8, 7] : [1, 2];
    const numberOnPiece = data.onPiece ? parseInt(data.onPiece.piece[1]) : null;
    if (data.onPiece && numberPiecesPlayer.includes(numberOnPiece) && dataGame.prom === false && dataGame.block === false) {
        const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        let position = data.piecePositions.find((element) => element.piece === data.onPiece.piece);
        const x = position.position[0] - 0.25;
        const y = position.position[1] + 0.1;
        let z = position.position[2] - 0.25;
        const numberPiece = parseInt(position.in[1]);
        if (numberPiece === 1 || numberPiece === 2) {
            z = position.position[2] + 0.25;
        };

        components.push(<BoxSelect key={1} position={[x, y, z]}/>);
        const number = parseInt(position.piece[1]);
        const numberPos = parseInt(position.in[1]);

        let extremePieceBlack = false;
        let extremePieceWhite = false;

        if (data.player === 'black') {
            extremePieceBlack = numberPos === 1 ? true : false;
        } else {
            extremePieceWhite = numberPos === 8 ? true : false;
        };

        const isExtreme = data.player === 'black' ? extremePieceBlack : extremePieceWhite;

        if (data.onPiece.name === 'p' && (!isExtreme)) {
            pawnMoves(data, numberPos, position, alphabet, number, numberPiece, numberPiecesPlayer, components);
        } else if (data.onPiece.name === 'r') {
            rookMoves(position, data, numberPiece, components, alphabet);
        } else if (data.onPiece.name === 'h') {
            horseMoves(position, alphabet, numberPiece, data, components);
        } else if (data.onPiece.name === 'b') {
            bishopMoves(numberPiece, alphabet, data, components);
        } else if (data.onPiece.name === 'k') {
            kingMoves(data, alphabet, numberPiece, components, position);
        } else if (data.onPiece.name === 'q') {
            queenMoves(data, alphabet, numberPiece, components, position);
        }
        return components;
    } 
}

export {
    renderBoxs,
    selectedPiece,
    dangers,
    findDanger,
    findProtection,
    setRotationPanel
}