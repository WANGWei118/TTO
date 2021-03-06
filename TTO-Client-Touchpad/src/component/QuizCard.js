import React from 'react';
import './QuizCard.css';
import { useHistory } from "react-router-dom";
import { SERVER_URL } from '../constants.js';
const INDIVIDUAL_TYPE = 'quizIndividuel';
let history;

const QuizCard = (props) => {
    history = useHistory();


    /**
    * Props or constants
    */
    const quiz = props.quiz
    const quizName = quiz.name
    const topic = quiz.topic;
    /**
     * redux
     */

    /**
     * States
     */


    console.log(quiz)

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
                <img className="quizImage" alt="Quiz sur le theme des Animaux" src={"http://10.189.147.120:10000/assets/animals.jpg"} />)
        }
        else {
            return (<img className="quizImage" alt="Quiz sur le theme des Fruits" src={"http://10.189.147.120:10000/assets/Fruits.jpg"} />)
        }
    }

    return (
        // <div className="quizCard" onClick={() => props.onClick()}>
        <div className="quizCard" onClick={() => handleClick(quiz)}>
            {quiz.src ? <img className="quizImage" src={SERVER_URL + quiz.src} /> :
                defaultImage()
            }

            <h2 className="quizName">{quizName}</h2>
        </div>
    )



}

export default QuizCard;
