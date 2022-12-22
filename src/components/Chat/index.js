import React, {useState} from "react";
import'./index.css';

const Chat = () => {
    const [chat, setChat] = useState(false);

    return(
        <div className="container-chat">
            <div className="info-chat">
                <div className='data-user-info'>
                    <div className='c-img-chat'>
                        <img src="pawnblack.png" alt="pawn" className="img-chat"></img>
                    </div>
                    <div className='username-chat'>
                        Chat with otro
                    </div>
                </div>
                <div className='container-arrow' onClick={() => setChat(!chat)}>
                    <img src={ chat ? 'arrow-up.svg' : 'arrow-down.svg'} className="icon-arrow"></img>
                </div>
            </div>
            { chat ? <>
                <div className="container-msg">
                <div className='msg-left'>
                    <div className='other-user'>
                        Mensaje user otro
                    </div>
                </div>
                <div className='msg-right'>
                    <div className='user-msg'>
                        Mensaje user otro
                    </div>
                </div>
            </div>
            <div className='container-form-msg'>
                <form className="form-msg">
                    <input type='text' placeholder='Send a message' className="inp-msg"></input>
                    <button className='btn-send'>
                        <img src='send.svg' alt='send icon'></img>
                    </button>
                </form>
            </div></> : null}
        </div>
    )
}

export default Chat;