import React from 'react';
import './QuizCard.css';
import { useHistory } from "react-router-dom";


let history;
const handleClick = (item) => {
    // console.log(item);
    history.push({
        pathname: '/quizGame',
        state: { quiz: { item } }
    });
}
const QuizCard = (props) => {
    history = useHistory();
    const quiz = props.quiz
    const quizName = quiz.name

    return (
        // <div className="quizCard" onClick={() => props.onClick()}>
        <div className="quizCard" onClick={() => handleClick(quiz)}>

            <img src="https://image.shutterstock.com/image-photo/colorful-flower-on-dark-tropical-260nw-721703848.jpg" />
            <h2 className="quizName">{quizName}</h2>
        </div>
    )
}

export default QuizCard;
