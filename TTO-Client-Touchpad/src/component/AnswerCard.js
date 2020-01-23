import React, { useState } from 'react';
import './AnswerCard.css';



const AnswerCard = (props) => {
    const [hide, setHide] = useState(false);
    const answer = props.answer

    const hideComponent = () => {
        if (props.canHide) {
            setHide(true);
        }
    }

    return (
        <>
            {hide ? <></> :
                <div className="answerCard" onClick={() => { props.onClick(answer); hideComponent(); }}>
                    <img src={answer.src} />
                    <h2 className="answerName">{answer.text}</h2>
                </div>
            }
        </>
    )


}



export default AnswerCard;
