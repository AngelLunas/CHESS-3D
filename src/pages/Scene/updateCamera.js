import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three';
import gsap from 'gsap';;

const UpdataCamera = ({data}) => {
    const ref = useRef(null);
    let waiting = false;
    let waiting2 = false;

    useFrame(state => {
        if ((data.colorPlayer === 'white' || data.colorPlayer === 'black') && data.playing === false && data.reset === false) {
            gsap.to(state.camera.position, {
                x: 0,
                y: 80, 
                z: 100,
                delay: 1,
                duration: 1,
                ease: 'power3.inOut',
                onUpdate: () => {
                    state.camera.lookAt(new THREE.Vector3(0, 0, 0));
                }
            });
        };

        if (data.setName && data.playing === false && waiting === false && !data.colorPlayer && data.roomFriend === false && data.reset === false) {
            waiting = true;
            gsap.to(state.camera.position, {
                y: 120, 
                z: 0,
                duration: 1,
                delay: 1.5,
                ease: 'power3.inOut',
                onUpdate: () => {
                    state.camera.lookAt(new THREE.Vector3(0, 0, 0))
                }
            });
        }

        if ((data.reset || data.leave) && waiting2 === false) {
            gsap.to(state.camera.position, {
                x: 40, 
                y: 40, 
                z: 95, 
                duration: 1,
                ease: 'power3.inOut',
                onUpdate: () => {
                    state.camera.lookAt(new THREE.Vector3(0, 0, 0));
                }
            });
            waiting2 = true;
        }
    });

    return (<mesh ref={ref}/>);
}

export default UpdataCamera;