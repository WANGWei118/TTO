import React from 'react';
import './QuizCard.css';
import { useHistory } from "react-router-dom";

const INDIVIDUAL_TYPE = 'quizIndividuel';
let history;
const url = 'http://localhost:10000/'

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
                <img className="quizImage" alt="Quiz sur le theme des Animaux" src={"http://localhost:10000/assets/animals.jpg"} />)
        }
        else {
            return (<img className="quizImage" alt="Quiz sur le theme des Fruits" src={"http://localhost:10000/assets/Fruits.jpg"} />)
        }
    }

    return (
        // <div className="quizCard" onClick={() => props.onClick()}>
        <div className="quizCard" onClick={() => handleClick(quiz)}>
            {quiz.src ? <img className="quizImage"  src={url + quiz.src} /> :
                defaultImage()
            }

            <h2 className="quizName">{quizName}</h2>
        </div>
    )



}

export default QuizCard;
