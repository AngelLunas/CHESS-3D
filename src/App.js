import React, { Suspense } from "react";
import Scene from "./pages/Scene";
import { OrbitControls } from '@react-three/drei';
import Panel from "./components/panel";
import Positions from "./components/context";

const Main = (props) => {

    return(
        <Scene>
            <color attach='background' args={['#000000']}/>
            <ambientLight intensity={0.8}/>
            <spotLight 
            castShadow
            color='#ffffff' 
            intensity={2}
            angle={1}
            penumbra={1}
            decay={2}
            distance={100}
            position={[0, 50, 40]}
            />
            <Suspense fallback={null}>
                <Positions>
                    <Panel />
                </Positions>
            </Suspense>
            <OrbitControls />
        </Scene>
    );
}

export default Main;