import React, { useState } from 'react';
import './AnswerCard.css';
import images from './images';



const AnswerCard = (props) => {
    const [hide, setHide] = useState(false);
    const answer = props.answer

    const hideComponent = () => {
        if (props.canHide) {
            setHide(true);
        }
    }
    let imageToDisplay;
    images.forEach((item) => {
        if (answer.src === item.src) {
            imageToDisplay = item.title;
        }
    }
    )
    return (
        <>
            {hide ? <></> :
                <div className="answerCard" onClick={() => { props.onClick(answer); hideComponent(); }}>
                    <img src={imageToDisplay} />
                    <h2 className="answerName">{answer.text}</h2>
                </div>
            }
        </>
    )
}



export default AnswerCard;
