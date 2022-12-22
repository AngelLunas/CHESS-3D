/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: danielpaulse (https://sketchfab.com/danielpaulse)
license: CC-BY-SA-4.0 (http://creativecommons.org/licenses/by-sa/4.0/)
source: https://sketchfab.com/3d-models/chess-piece-knight-736236d00cfe4cb9a88bee6b4c833e41
title: Chess Piece - Knight
*/

import React, { useContext } from 'react';
import { useGLTF } from '@react-three/drei';
import { positionsContext } from '../components/context';

export function HorseModel(props) {
  const { nodes, materials } = useGLTF('/horse.gltf');
  const data = useContext(positionsContext);
  
  const rotation = props.color === 'white' ? -0.10 : 3.2;

  return (
    <group {...props} dispose={null} onClick={() => {if (props.name) {
      data.setOnPiece({piece: props.name, name: 'h'});
    }
    }}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, rotation, 0]}>
          <group position={[0.03, 0, 0]} scale={280}>
            <mesh geometry={nodes.Object_4.geometry} material={props.color === 'white' ? materials.White_Square : materials.Black_Square} />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/horse.gltf')
