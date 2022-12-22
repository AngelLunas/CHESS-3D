import React, { useContext } from "react";
import { positionsContext } from "../context";
import { detectMove } from "./hooks";
import { useDispatch } from "react-redux";

const CircleMove = (props) => {
    const data = useContext(positionsContext);
    const dispatch = useDispatch();

    return(
        <mesh position={props.position} onClick={() => detectMove(data, props, dispatch)}>
            <cylinderGeometry args={[2.5, 2.5, 0.4, 64]}/>
            <meshStandardMaterial color='#D8D8D8'/>
        </mesh>
    );
}

export default CircleMove;