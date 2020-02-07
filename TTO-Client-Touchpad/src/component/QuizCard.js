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
    const topic = quiz.topic;

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
    const defaultImage = () => {
        if (topic === 'animal') {
            return (
                <img src={"http://192.168.1.11:1000/assets/animals.jpg"} />)
        }
        else {
            return (<img src={"http://192.168.1.11:1000/assets/Fruits.jpg"} />)
        }
    }

    return (
        // <div className="quizCard" onClick={() => props.onClick()}>
        <div className="quizCard" onClick={() => handleClick(quiz)}>
            {quiz.src ? <img src={quiz.src} /> :
                defaultImage()
            }

            <h2 className="quizName">{quizName}</h2>
        </div>
    )



}

export default QuizCard;
