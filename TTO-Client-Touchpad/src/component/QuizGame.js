import React, { useState } from 'react';
import './QuizGame.css';
import AnswerCard from './AnswerCard';
import { Button } from 'antd';
import "antd/dist/antd.css";
import { useHistory } from "react-router-dom";
const nextArrow = require('./../assets/right_arrow.png')
const home_menu = require('./../assets/home_menu.png')
const restarto = require('./../assets/reload_icon.jpg')

let questions;
let correctAnswer;

const QuizGame = (props) => {
    const history = useHistory();

    console.log(props)
    const [quiz] = useState(props.location.state.quiz.item);
    const [quizOver, setQuizOver] = useState(false);
    const [showExplaination, setShowExplaination] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [index, setIndex] = useState(0);
    const [numberOfPlay, setNumberOfPlay] = useState(1);

    const renderQuestion = () => {

        return (
            <>
                {!loaded ? <></> :
                    <div>
                        <div className="descriptionDiv">
                            <h1>{currentQuestion.description}</h1>
                        </div>
                        <div>
                            {showExplaination ? renderExplaination() :
                                <section className="answerSection">
                                    {currentQuestion.answers.map((item) => {
                                        if (item.id === currentQuestion.rightAnwer.id) {
                                            correctAnswer = item;
                                        }
                                        return <AnswerCard key={item.id} answer={item} onClick={(answer) => checkAnswer(answer)} canHide={true} />
                                    })}
                                </section>}
                        </div>
                    </div>
                }
            </>
        )
    }

    const renderExplaination = () => {
        return (
            <div>
                <div className="descriptionDiv">
                    <h1>Oui ! Bonne réponse !</h1>
                </div>
                <div className="explanationDiv">
                    <AnswerCard answer={correctAnswer} onClick={() => { }} canHide={false} />
                    <p>{currentQuestion.explains}</p>
                    <img src={nextArrow} alt="Prochaine question" className="rightArrow" onClick={() => nextQuestion()} />
                </div>
            </div>
        )
    }

    const renderEnd = () => {
        return (
            <div className='finishDiv'>
                <div className="descriptionDiv">
                    <h1 className="bravoTitle">Bravo ! Tu as terminé !</h1>
                    <p className="bravoMessage">Tu peux revenir au menu ou recommencer</p>
                </div>
                <div className="navigation">
                    <div className="quitDivEnd">
                        <img src={home_menu} alt="Retourner au menu" className="homeMenu" onClick={() => navigateToMenu()} />
                        {/* <Button type="primary" onClick={() => navigateToMenu()}> Quitter</Button> */}
                    </div>
                    <div className="restartDivEnd">
                        <img src={restarto} alt="Recommencer le quiz" onClick={() => restart()} />
                        {/* <Button type="primary" onClick={() => restart()}>Recommencer</Button> */}
                    </div>
                </div>
            </div>
        )
    }

    const initQuiz = () => {

        questions = quiz.questions;
        setCurrentQuestion(questions[index]);
        setLoaded(true);

    }


    const checkAnswer = (answer) => {
        if (answer.id === currentQuestion.rightAnwer.id) {
            setShowExplaination(true);
        }
    }

    const nextQuestion = () => {
        if (index < questions.length - 1) {
            setShowExplaination(false);
            setCurrentQuestion(questions[index + 1]);
            setIndex(index + 1)

        } else {
            setQuizOver(true)
        }
    }

    const navigateToMenu = () => {
        history.push('/')
    }
    if (!loaded) {
        initQuiz();
    }

    const restart = () => {
        setIndex(0);
        setCurrentQuestion(questions[0]);
        setQuizOver(false);
        setShowExplaination(false);
        setNumberOfPlay(numberOfPlay + 1);
    }


    return (
        <>
            {quizOver ? <></> :
                <div className="navigation">
                    <div className="quitDiv">
                        <Button type="primary" onClick={() => navigateToMenu()}>Quitter</Button>
                    </div>

                    <div className="nextQuestionDiv">
                        <Button type="primary" onClick={nextQuestion}>Question suivante</Button>
                    </div>
                </div>}

            {quizOver ? renderEnd() : renderQuestion()}
        </>
    )

}

export default QuizGame;
