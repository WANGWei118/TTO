import React from 'react';
import './QuizCard.css';
import { useHistory } from "react-router-dom";

const INDIVIDUAL_TYPE = 'quizIndividuel';
const COLLAB_TYPE = 'quizNonTangible';
let history;

const QuizCard = (props) => {
    history = useHistory();
    const quiz = props.quiz
    const quizName = quiz.name

    const handleClick = (item) => {
        console.log(item);
        if (props.type === INDIVIDUAL_TYPE) {
            history.push({
                pathname: '/quizGame',
                state: { quiz: { item } }
            });
        } else {
            history.push({
                pathname: '/quizGameCollab',
                state: { quiz: { item } }
            });
        }
    }

    return (
        // <div className="quizCard" onClick={() => props.onClick()}>
        <div className="quizCard" onClick={() => handleClick(quiz)}>
            {quiz.src ? <img className="quizImage" src={quiz.src} /> : <img className="quizImage" src={"https://image.shutterstock.com/image-photo/colorful-flower-on-dark-tropical-260nw-721703848.jpg"} />}

            <h2 className="quizName">{quizName}</h2>
        </div>
    )



}

export default QuizCard;
