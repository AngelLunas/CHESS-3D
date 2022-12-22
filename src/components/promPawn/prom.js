import React from "react";
import { useDispatch } from "react-redux";
import { setProm } from "../../slice";
import './index.css';

const Prom = (props) => {
    const dispatch = useDispatch();
    function onClickProm (value) {
        dispatch(setProm({prom: false, color: '', value}));
    }
    return(
        <div className="container-prom">
            <div className="pop-up">
                <div className='container-image'>
                    <img src={`queen${props.color}.png`} alt='queen chess' className="piece-image" draggable={false} onClick={() => onClickProm(1)}/>
                </div>
                <div className='container-image'>
                    <img src={`horse${props.color}.png`} alt='horse chess' className="piece-image" draggable={false}  onClick={() => onClickProm(3)}/>
                </div>
                <div className='container-image'>
                    <img src={`rook${props.color}.png`} alt='rook chess' className="piece-image" draggable={false}  onClick={() => onClickProm(2)}/>
                </div>
                <div className='container-image'>
                    <img src={`bishop${props.color}.png`} alt='bishop chess' className="piece-image" draggable={false}  onClick={() => onClickProm(4)}/>
                </div>
            </div>
        </div>
    )
}

export default Prom;