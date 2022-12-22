import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    prom: false,
    color: '',
    value: null,
    indexPiece: null,
    block: true,
    colorPlayer: null,
    playing: false,
    setName: false,
    waiting: false,
    waitingGame: null,
    endGame: false,
    colorWin: null,
    replay: false,
    namePlayer: null,
    enemy: null,
    createRoom: false,
    hostRoom: '',
    roomFriend: false,
    noRoom: false,
    action: false,
    reset: false,
    leave: false,
    noPlayer: false
};

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setProm: (state, action) => {
            state.prom = action.payload.prom;
            state.color = action.payload.color;
            state.value = action.payload.value;
            if (action.payload.indexPiece) {
                state.indexPiece = action.payload.indexPiece;
            };
        },
        setBLock: (state, action) => {
            state.block = action.payload;
        },
        setColorPlayer: (state, action) => {
            state.colorPlayer = action.payload;
        },
        setPlaying: (state, action) => {
            state.playing = action.payload;
        },
        setNamePlayer: (state, action) => {
            state.setName = action.payload;
        },
        setWaiting: (state, action) => {
            state.waiting = action.payload;
        },
        setWaitingGame: (state, action) => {
            state.waitingGame = action.payload;
        },
        setEndGame: (state, action) => {
            state.endGame = action.payload;
        },
        setColorWin: (state, action) => {
            state.colorWin = action.payload;
        },
        setReplay: (state, action) => {
            state.replay = action.payload;
        },
        setEnemy: (state, action) => {
            state.enemy = action.payload;
        },
        setCreateRoom: (state, action) => {
            state.createRoom = action.payload;
        },
        setHostRoom: (state, action) => {
            state.hostRoom = action.payload;
        },
        setFriendRoom: (state, action) => {
            state.roomFriend = action.payload;
        },
        setNoRoom: (state, action) => {
            state.noRoom = action.payload;
        },
        setAction: (state, action) => {
            state.action = action.payload;
        }, 
        resetData: (state, action) => {
            state.action = initialState.action;
            state.block = initialState.block;
            state.color = initialState.color;
            state.colorPlayer = initialState.colorPlayer;
            state.colorWin = initialState.colorWin;
            state.createRoom = initialState.createRoom;
            state.endGame = initialState.endGame;
            state.enemy = initialState.enemy;
            state.hostRoom = initialState.hostRoom;
            state.indexPiece = initialState.indexPiece;
            state.namePlayer = initialState.namePlayer;
            state.noRoom = initialState.noRoom;
            state.playing = initialState.playing;
            state.prom = initialState.prom;
            state.replay = initialState.replay;
            state.roomFriend = initialState.roomFriend;
            state.setName = initialState.setName;
            state.value = initialState.value;
            state.waiting = initialState.waiting;
            state.waitingGame = initialState.waitingGame;
            state.noPlayer = initialState.noPlayer;
            if (action.payload === false) {
                state.reset = true;
            } else {
                state.reset = false;
            }
        },
        setReset: (state, action) => {
            state.reset = action.payload;
        },
        setLeave: (state, action) => {
            state.leave = action.payload;
        },
        setNoPlayer: (state, action) => {
            state.noPlayer = action.payload;
        }
    }
});

export const { 
    setProm, 
    setBLock, 
    setColorPlayer, 
    setPlaying, 
    setNamePlayer, 
    setWaiting, 
    setWaitingGame, 
    setEndGame, 
    setColorWin, 
    setReplay, 
    setEnemy, 
    setCreateRoom, 
    setHostRoom,
    setFriendRoom,
    setNoRoom,
    setAction,
    resetData,
    setReset,
    setLeave,
    setNoPlayer
} = gameSlice.actions;
export default gameSlice.reducer;