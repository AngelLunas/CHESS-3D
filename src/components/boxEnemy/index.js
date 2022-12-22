import React, { useContext } from "react";
import { positionsContext } from "../context";
import { killPiece } from "./hooks";
import { useDispatch } from "react-redux";

const BoxEnemy = (props) => {
    const data = useContext(positionsContext);
    const dispatch = useDispatch();

    return(
        <mesh position={props.position} onClick={() => killPiece(props.piece, props.pieceKill, data, dispatch)}>
            <boxGeometry args={[12.7, 2.2, 12.7]} />
            <meshStandardMaterial color='#b31616' />
        </mesh>
    );
}

export default BoxEnemy;