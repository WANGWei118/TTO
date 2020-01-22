import React, { useState } from 'react';
import './AnswerCard.css';



const AnswerCard = (props) => {
    const [hide, setHide] = useState(false);
    const answer = props.answer

    const hideComponent = () => {
        setHide(true);
    }

    return (
        <>
            {hide ? <></> :
                <div className="answerCard" onClick={() => { props.onClick(answer); hideComponent(); }}>
                    <img src="https://image.shutterstock.com/image-photo/colorful-flower-on-dark-tropical-260nw-721703848.jpg" />
                    <h2 className="answerName">{answer.text}</h2>
                </div>
            }
        </>
    )


}



export default AnswerCard;
