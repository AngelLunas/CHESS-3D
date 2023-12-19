import React, { createContext, useState, useEffect } from "react";
import { positionsFrames } from "./frames";
import { playSound } from "../Circle/hooks";
import io from 'socket.io-client';
import { useDispatch, useSelector } from "react-redux";
import { setBLock, setColorPlayer, setEndGame, setPlaying, setColorWin, setWaitingGame, setEnemy, setCreateRoom, setHostRoom, setNoRoom, setFriendRoom, setReset, setLeave, setNoPlayer } from "../../slice";
import { dataPositions } from "./dataPositions";

const socket = io.connect('https://chess-3d-backend.fly.dev/');

const positionsContext = createContext();

const Positions = ({children}) => {
    const [piecePositions, setPiecePositions] = useState(dataPositions);
    const [onPiece, setOnPiece] = useState(false);
    const [player, setPlayer] = useState('white');
    const [checkmate, setCheckmate] = useState(false);
    const [block, setBlock] = useState(false);
    const [dataGame, setDataGame] = useState(null);
    const dispatch = useDispatch();
    const dataGameRed = useSelector(state => state.game);

    useEffect(() => {
        if (dataGameRed.setName && dataGameRed.action === false) {
            socket.emit('newUser', dataGameRed.setName);
        }
    }, [dataGameRed.setName]);

    useEffect(() => {
        if (dataGameRed.createRoom) {
            socket.emit('createRoom', dataGameRed.setName);
        }
    }, [dataGameRed.createRoom]);

    useEffect(() => {
        if (dataGameRed.roomFriend) {
            socket.emit('joinRoom', {
                name: dataGameRed.setName,
                room: dataGameRed.roomFriend
            });
        }
    }, [dataGameRed.roomFriend]);

    useEffect(() => {
        if (dataGameRed.leave) {
            socket.emit('leave');
        }
    }, [dataGameRed.leave]);

    useEffect(() => {
        if (dataGameRed.replay) {
            setOnPiece(false);
            setCheckmate(false);
            setDataGame(null);
            socket.emit('playAgain', 'play again');
        };
    }, [dataGameRed.replay]);

    useEffect(() => {
        if (dataGameRed.reset) {
            socket.emit('reset', 'reset');
        };
    }, [dataGameRed.reset]);

    useEffect(() => {

        socket.on('dataPlayer', (data) => {
            dispatch(setReset(false));
            dispatch(setLeave(false));
            dispatch(setFriendRoom(false));
            dispatch(setCreateRoom(false));
            dispatch(setHostRoom(false));
            dispatch(setEnemy(data.enemy));
            dispatch(setWaitingGame(false));
            setPlayer(data.user.color);
            dispatch(setColorPlayer(data.user.color));
            setPiecePositions(data.dataPositions);
            if (data.user.color === 'black') {
                dispatch(setBLock(true));
            } else {
                dispatch(setBLock(false));
            };
            setTimeout(() => {
                dispatch(setPlaying(true));
            }, 400);
        });

        socket.on('serverRoom', (data) => {
            dispatch(setReset(false));
            dispatch(setLeave(false));
            dispatch(setWaitingGame(true));
        });

        socket.on('moveServer', (data) => {
            playSound('move-chess.wav');
            dispatch(setBLock(false));
            setPiecePositions(data);
        });

        socket.on('leaveServer', (data) => {
            dispatch(setColorWin(data));
            dispatch(setBLock(true));
            playSound('win-chess.mp3');
            dispatch(setPlaying(false));
            dispatch(setColorPlayer(null));
            dispatch(setEndGame(true));
            dispatch(setEnemy(null));
        });

        socket.on('killServer', (data) => {
            playSound('kill-chess.wav');
            dispatch(setBLock(false));
            setPiecePositions(data);
        });

        socket.on('checkmateServer', (data) => {
            playSound('chess-checkmate.wav');
            setPiecePositions(data);
            setCheckmate(true);
        });

        socket.on('checkmate2Server', (data) => {
            playSound('game-over.mp3');
            dispatch(setColorWin(player));
            dispatch(setEndGame(true));
            dispatch(setEnemy(null));
            setPiecePositions(data);
            setCheckmate(true);
            dispatch(setPlaying(false));
            setTimeout(() => {
                dispatch(setBLock(true));
            }, 100);
        });

        socket.on('promPawnServer', (data) => {
            playSound('move-chess.wav');
            dispatch(setBLock(false));
            setPiecePositions(data);
        });

        socket.on('numberRoom', (data) => {
            dispatch(setHostRoom(data.host));
        });

        socket.on('noRoom', (data) => {
            dispatch(setNoRoom(data));
        });

        socket.on('noPlayer', (data) => {
            dispatch(setNoPlayer(true));
        });

        return () => {
            socket.off('serverRoom', (clientRoom) => {
            });
        }
    }, []);
 
    return(
        <positionsContext.Provider value={{
            piecePositions, 
            setPiecePositions,
            onPiece, 
            setOnPiece,
            positionsFrames,
            player,
            setPlayer,
            checkmate,
            setCheckmate,
            block, 
            setBlock,
            socket,
            dispatch,
            dataGameRed
        }}>
            {children}
        </positionsContext.Provider>
    );
}

export default Positions;
export {
    positionsContext
};