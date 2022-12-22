import React, { useState, useEffect, useRef } from 'react';
import Scene from '../Scene';
import ClipLoader from "react-spinners/ClipLoader";
import gsap from 'gsap';
import { resetData, setAction, setCreateRoom, setEndGame, setFriendRoom, setNamePlayer, setReplay, setWaitingGame } from '../../slice';
import { useDispatch, useSelector } from 'react-redux';
import { calculateTopScene } from './hooks';
import './index.css';

const override = {
    display: "block",
    margin: "auto",
};

const Home = () => {
    const [name, setName] = useState('');    
    const [error, setError] = useState(false);
    const [codeRoom, setCodeRoom] = useState(false);
    const [roomFriend, setRoomFriend] = useState('');
    const [errorFriend, setErrorFriend] = useState(false);
    const [loadingRoom, setLoadingRoom] = useState(false);
    const dispatch = useDispatch();
    const gameData = useSelector(state => state.game);
    const containerRef = useRef(null);
    const containerSceneRef = useRef(null);
    const point1 = useRef(null);
    const point2 = useRef(null);
    const point3 = useRef(null);
    const join = useRef(null);
    const inputRoom = useRef(null);
    const inputName = useRef(null);

    useEffect(() => {
        if (gameData.waitingGame) {
            gsap.to(point1.current, {
                opacity: 0,
                duration: 1,
                repeat: -1,
                yoyo: true,
                delay: .3
            });
            gsap.to(point2.current, {
                opacity: 0,
                duration: 1,
                repeat: -1,
                yoyo: true,
                delay: .6
            });
            gsap.to(point3.current, {
                opacity: 0,
                duration: 1,
                repeat: -1,
                yoyo: true,
                delay: .9
            });
        }
    }, [gameData.waitingGame]);

    useEffect(() => {
        if ((gameData.setName || gameData.createRoom) && gameData.roomFriend === false ) {
            gsap.to(containerSceneRef.current, {
                opacity: 0,
                duration: .3,
                width: '100vw'
            });

            gsap.to(containerRef.current, {
                x: '-200%',
                duration: 1.3,
                opacity: 0,
                delay: .2    
            });

            gsap.to(containerSceneRef.current, {
                left: 0,
                opacity: 1,
                duration: .8,
            }, '-=2');
        }
    }, [gameData.setName, gameData.roomFriend, gameData.createRoom]);

    useEffect(() => {
        if (gameData.reset || gameData.leave) {
            let width = '';
            let left = '';
            
            if (window.innerWidth > 1024) {
                width = '60%';
                left = '40%'
            } else {
                width = '100%';
                left = '0';
            }

            gsap.to(containerSceneRef.current, {
                opacity: 1,
                duration: .3,
                width
            });
            gsap.to(containerRef.current, {
                x: 0,
                duration: 1.3,
                opacity: 1, 
                delay: .2
            });
            gsap.to(containerSceneRef.current, {
                left,
                opacity: 1,
                duration: .8
            }, '-=2');
        }
    }, [gameData.reset, gameData.leave]);

    useEffect(() => {
        if (codeRoom) {
            gsap.to(join.current, {
                x: 0,
                duration: 1,
                opacity: 1
            });
        } else {
            gsap.to(join.current, {
                x: -1000,
                duration: 1,
                opacity: 0
            });
        }
    }, [codeRoom]);

    const backButton = () => {
        setName('');
        setError(false);
        setCodeRoom(false);
        setRoomFriend('');
        setErrorFriend(false);
        setLoadingRoom(false);
        dispatch(resetData(false));
        inputName.current.value = '';
    }

    useEffect(() => {
        if (gameData.noPlayer) {
            backButton();
        }
    }, [gameData.noPlayer]);

    useEffect(() => {
        if (gameData.noRoom) {
            setErrorFriend(gameData.noRoom);
            inputRoom.current.value = '';
            setLoadingRoom(false);
        }
    }, [gameData.noRoom]);

    useEffect(() => {
        if (gameData.leave) {
            setName('');
            setError(false);
            setCodeRoom(false);
            setRoomFriend('');
            setErrorFriend(false);
            setLoadingRoom(false);
            dispatch(resetData(true));
            inputName.current.value = '';
        }
    }, [gameData.leave]);

    const onSubmit = (e) => {
        e.preventDefault();
        if (name.length <= 0) {
            setError(true);
            return;
        }
        setError(false);
        dispatch(setNamePlayer(name));
    }

    const onChange = (e) => {
        setName(e.target.value);
    }

    const onChangeRoom = (e) => {
        setRoomFriend(e.target.value);
    }

    const playAgain = () => {
        dispatch(setReplay(true));
        dispatch(setWaitingGame(true));
        dispatch(setEndGame(false));
    }

    const createRoom = () => {
        if (name.length <= 0) {
            setError(true);
            return;
        }
        setError(false);
        dispatch(setAction('create'));
        dispatch(setNamePlayer(name));
        dispatch(setCreateRoom(true));
    }

    const joinRoom = (e) => {
        e.preventDefault();
        if (name.length <= 0) {
            setError(true);
            return;
        };
        setError(false);
        if (roomFriend.length <= 0) {
            setErrorFriend('Room is required');
            return;
        }
        setLoadingRoom(true);
        setErrorFriend(false);
        dispatch(setAction('join'));
        dispatch(setFriendRoom(roomFriend));
        dispatch(setNamePlayer(name));
    } 

    const inCodeRoom = () => {
        setCodeRoom(!codeRoom);
    };

    return(
        <div className='container-home'>
            <div className='description-home' ref={containerRef}>
                <div className='container-icon-home'>
                    <img src='chess-icon.png' alt='chess icon' className='icon'></img>
                </div>
                <h1 className='title-home'>Chess multiplayer</h1>
                <div>
                    <form onSubmit={onSubmit}>
                        <input placeholder={error ? 'Name is required' : 'Write your name'} type='text' className={error ? 'input-name-error' : 'input-name'} onChange={onChange} ref={inputName}/>
                        <button className='play-button'>
                            Play with random
                        </button>
                    </form>
                    <div>
                        <div className='friend-container'>
                            <span className='line'></span>
                            <span className='play-friend'>
                                Or play with a friend
                            </span>
                            <span className='line'></span>
                        </div>
                        <div className='container-room'>
                            <button className='button-room' onClick={createRoom}> 
                                Create room
                            </button>
                            <button className='button-room' onClick={inCodeRoom}>
                                Join a room
                            </button>
                        </div>
                        <form className='container-join' ref={join} onSubmit={joinRoom}>
                            <input type='text' placeholder={errorFriend ? errorFriend : 'Write the room code'} className={errorFriend ? 'room-error' : 'input-room'} onChange={onChangeRoom} ref={inputRoom}></input>
                            <button className='join-button'>
                                {loadingRoom ? null : 'Join'}
                                <ClipLoader
                                    color='#000000'
                                    loading={loadingRoom}
                                    cssOverride={override}
                                    size={10}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                                />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className='image-home' ref={ containerSceneRef } style={{top: calculateTopScene(gameData)}}>
                <Scene />
            </div>
            {gameData.waitingGame && gameData.createRoom === false && gameData.roomFriend === false ? <div className='container-waiting'>
                <div className='waiting'>
                    <span className='title-waiting'>
                        Waiting player
                    </span>
                    <span className='point' ref={point1}>
                    </span>
                    <span className='point' ref={point2}>
                    </span>
                    <span className='point' ref={point3}>
                    </span>
                </div>
                <button className='back-button-p' onClick={backButton}>
                    <img src='back.svg' className='back-img' alt='back'></img>
                </button>
            </div> : null}
            {gameData.endGame ? <div className='container-replay'>
                <div className='container-again'>
                    <span className='title-win'>
                        {`${gameData.colorWin} win!`}
                    </span>
                    <button className='play-button' onClick={playAgain}>
                        Play again
                    </button>
                </div>
                <button className='back-button' onClick={backButton}>
                    <img src='back.svg' className='back-img' alt='back'></img>
                </button>
            </div> : null}
            {gameData.createRoom ? <div className='container-waiting'>
                <div className='waiting-room'>
                    <div className='loading'>
                        <span className='title-waiting'>
                            Waiting friend
                        </span>
                        <span className='point' ref={point1}>
                        </span>
                        <span className='point' ref={point2}>
                        </span>
                        <span className='point' ref={point3}>
                        </span>
                    </div>
                    <div>
                        <span className='room-title'>
                            {`Your room code is: ${gameData.hostRoom}`}
                        </span>
                    </div>
                </div>
                <button className='back-button-f' onClick={backButton}>
                    <img src='back.svg' className='back-img' alt='back'></img>
                </button>
            </div> : null}
        </div>
    )
};

export default Home;