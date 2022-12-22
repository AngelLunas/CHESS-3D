import React, { useContext, useEffect, useRef } from 'react';
import { renderBoxs, selectedPiece, setRotationPanel } from './hooks';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import baseColorUrl from '../../assets/textures/white/Plastic_002_basecolor.jpg';
import ambientOclussionUrl from '../../assets/textures/white/Plastic_002_ambientOcclusion.jpg';
import heightUrl from '../../assets/textures/white/Plastic_002_height.png';
import normalUrl from '../../assets/textures/white/Plastic_002_normal.jpg';
import roughnessUrl from '../../assets/textures/white/Plastic_002_roughness.jpg';
import { positionsContext } from '../context';
import { useSelector } from 'react-redux';
import { dangers } from './hooks';
import { setBLock } from '../../slice';

const Panel = (props) => {
    const [baseColor, ambientOclussion, height, normal, roughness] = useLoader(TextureLoader, [
        baseColorUrl,
        ambientOclussionUrl,
        heightUrl,
        normalUrl,
        roughnessUrl
    ]);
    const meshRef = useRef(null);
    const data = useContext(positionsContext);
    const dataGame = useSelector(state => state.game);

    useFrame(() => {
        if (dataGame.waitingGame && dataGame.roomFriend === false) {
            return meshRef.current.rotation.y -= 0.01
        }
        return null;
        });

    useEffect(() => {
        if (dataGame.value !== null) {
            const arrData = data.piecePositions.slice();
            const index = dataGame.indexPiece;
            arrData[index].prom = dataGame.value;
            switch (dataGame.value) {
                case 1: 
                    arrData[index].name = 'q';
                    break;
                case 2: 
                    arrData[index].name = 'r';
                    break;
                case 3:
                    arrData[index].name = 'h';
                    break;
                case 4: 
                    arrData[index].name = 'b';
                    break;
                default:
                    arrData[index].name = 'q';
                    break;
            };

            data.setPiecePositions(arrData);
            dangers(data, arrData, true, false);
            data.socket.emit('promPawn', {
                data: arrData
            });
            data.dispatch(setBLock(true));
        };
    }, [dataGame.value]);

    return(
        <mesh rotation={setRotationPanel(dataGame.colorPlayer)} ref={meshRef}>
            <boxGeometry args={ [115, 10, 115] }/>
            <meshStandardMaterial map={baseColor}
             aoMap={ambientOclussion}
             displacementMap={height}
             normalMap={normal}
             roughnessMap={roughness}
             displacementScale={0.01}
            />
            <mesh>
                <boxGeometry args={ [100, 10, 100] }/>
                <meshStandardMaterial visible={ false }/>
                { renderBoxs(data) }
                { selectedPiece(data, dataGame) }
            </mesh>
        </mesh>
    );
}

export default Panel;