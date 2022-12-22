import React, { useRef, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useSelector } from "react-redux";
import { OrbitControls } from '@react-three/drei';
import Panel from '../../components/panel/index.js';
import Positions from "../../components/context/index.js";
import { Provider } from 'react-redux';
import { store } from "../../store.js";
import { useDispatch } from "react-redux";
import Prom from "../../components/promPawn/prom.js";
import UpdataCamera from "./updateCamera.js";
import gsap from "gsap";
import './index.css';
import { setLeave } from "../../slice.js";

const Scene = (props) => {
    const gameData = useSelector(state => state.game);
    const containerRef = useRef(null);
    const btnLeave = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (gameData.setName && gameData.roomFriend === false) {
            gsap.to(containerRef.current, {
                opacity: 1,
                duration: 2, 
                delay: 1.7
            });
            gsap.to(btnLeave.current, {
                opacity: 1,
                duration: 2, 
                delay: 1.7
            });
        }
    }, [gameData.setName, gameData.roomFriend]);

    useEffect(() => {
        if (gameData.reset || gameData.leave) {
            gsap.to(containerRef.current, {
                opacity: 0
            });
            gsap.to(btnLeave.current, {
                opacity: 0,
            });
        }
    }, [gameData.reset, gameData.leave]);

    const onLeave = () => {
        dispatch(setLeave(true));
    };

    return(
        <div className='container-scene'>
            <Canvas camera={{position: [40, 40, 95]}} style={{position: 'absolute'}}>
                <UpdataCamera data={gameData}/>
                <color attach='background' args={['#222226']}/>
                <ambientLight intensity={0.3}/>
                <spotLight 
                castShadow
                color='#ffffff' 
                intensity={3}
                angle={10}
                penumbra={1}
                decay={2}
                distance={100}
                position={[0, 50, 40]}
                />
                <Suspense fallback={null}>
                    <Provider store={store}>
                        <Positions>
                            <Panel />
                        </Positions>
                    </Provider>
                </Suspense>
                <OrbitControls />
            </Canvas> 
            {gameData.prom ? <Prom color={gameData.color} /> : null}
            <div className='interface'>
                <div className="data-left" ref={containerRef}>
                    <div className='info-user'>
                        <div className='container-user'>
                            <div className='img-user'>
                                <img src={gameData.waitingGame || gameData.endGame || gameData.playing === false ? "pawnwhite.png" : `pawn${gameData.enemy.color}.png`} alt='pawn' className="icon-user" draggable={false}></img>
                            </div>
                            <span className='user-name'>{gameData.enemy ? gameData.enemy.user : '...'}</span>
                        </div>
                    </div>
                    <div className='info-user'>
                        <div className='container-user'>
                            <div className='img-user'>
                                <img src={gameData.waitingGame || gameData.endGame || gameData.playing === false ? "pawnwhite.png" : `pawn${gameData.colorPlayer}.png`} alt='pawn' className="icon-user" draggable={false}></img>
                            </div>
                            <span className='user-name'>{gameData.setName}</span>
                        </div>
                    </div>
                </div>
            </div>
            <button className="btn-leave" ref={btnLeave} onClick={onLeave}>
                Leave
            </button>
        </div>
    );
}

export default Scene;
