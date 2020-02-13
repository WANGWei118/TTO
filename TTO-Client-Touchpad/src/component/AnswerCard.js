import React, { useState } from 'react';
import './AnswerCard.css';
import images from './images';



const AnswerCard = (props) => {
    const [hide, setHide] = useState(false);
    const [hideClass, setHideClass] = useState('answerCard');
    const answer = props.answer

    const hideComponent = () => {
        if (props.canHide) {

            setHideClass(hideClass + ' hidden');
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
            <div className={hideClass} onClick={() => { props.onClick(answer); hideComponent(); }}>
                <img className="answerCardImage" src={answer.src} />
                {/* <h2 className="answerName">{answer.text}</h2> */}
            </div>
        </>
    )
}



export default AnswerCard;
