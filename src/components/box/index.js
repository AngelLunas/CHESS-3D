import React from "react";
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from "three";
import baseColorUrl1 from '../../assets/textures/white/Plastic_002_basecolor.jpg';
import ambientOclussionUrl1 from '../../assets/textures/white/Plastic_002_ambientOcclusion.jpg';
import heightUrl1 from '../../assets/textures/white/Plastic_002_height.png';
import normalUrl1 from '../../assets/textures/white/Plastic_002_normal.jpg';
import roughnessUrl1 from '../../assets/textures/white/Plastic_002_roughness.jpg';
import baseColorUrl2 from '../../assets/textures/black/Terrazzo_002_basecolor.jpg';
import ambientOclussionUrl2 from '../../assets/textures/black/Terrazzo_002_ambientOcclusion.jpg';
import heightUrl2 from '../../assets/textures/black/Terrazzo_002_height.png';
import normalUrl2 from '../../assets/textures/black/Terrazzo_002_normal.jpg';
import roughnessUrl2 from '../../assets/textures/black/Terrazzo_002_roughness.jpg';

const Frame = (props) => {
    const { args, color, position } = props;

    const [baseColor1, ambientOclussion1, height1, normal1, roughness1] = useLoader(TextureLoader, [
        baseColorUrl1,
        ambientOclussionUrl1,
        heightUrl1,
        normalUrl1, 
        roughnessUrl1
    ]);

    const [baseColor2, ambientOclussion2, height2, normal2, roughness2] = useLoader(TextureLoader, [
        baseColorUrl2,
        ambientOclussionUrl2,
        heightUrl2,
        normalUrl2,
        roughnessUrl2
    ]);

    return(
        <mesh position={position}>
            <boxGeometry args={args}/>
            <meshStandardMaterial displacementScale={0.001} 
             alphaTest={0.5}
             side={THREE.DoubleSide}
             map={color ? baseColor1 : baseColor2}
             aoMap={color ? ambientOclussion1 : ambientOclussion2}
             normalMap={color ? normal1 : normal2}
             roughnessMap={color ? roughness1 : roughness2}
             displacementMap={color ? height1 : height2}
            />
        </mesh>
    );
};

export default Frame;