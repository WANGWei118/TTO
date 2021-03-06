import React, { useState, useEffect } from 'react';
import './QuizGameCollab.css'
import DraggableContainer from './individuel/DraggableContainer';
import { useHistory } from 'react-router-dom';
import HeaderComponent from './HeaderComponent';
const home_menu = require('./../assets/home_menu.png')
const restarto = require('./../assets/reload_icon.jpg')

const style = {
    overflow: 'hidden'
}

let nbRightAnswers = 0;

const QuizGameCollab = props => {

    /**
    * Props or constants
    */

    const quiz = props.location.state.quiz.item;
    const questions = quiz.questions;
    const history = useHistory();

    /**
     * redux
     */

    const [currentQuestion, setCurrentQuestion] = useState(questions[0]);
    const [centralDiv, setCentralDiv] = useState(undefined);
    const [index, setIndex] = useState(0);
    const [isOver, setIsOver] = useState(false);

    /**
     * States
     */

    const nextQuestion = () => {

        if (index < questions.length - 1) {
            setCurrentQuestion(questions[index + 1]);
            setIndex(index + 1)
            // setNbRightAnswers(0);
            nbRightAnswers = 0;
        } else {
            setIsOver(true);
        }
    }

    const validatePosition = (element, isAnswer) => {
        const elementBounding = element.target.getBoundingClientRect();
        const centralDivBounding = centralDiv.getBoundingClientRect();

        const elementCentralX = (elementBounding.x + (elementBounding.x + elementBounding.width)) / 2
        const elementCentralY = (elementBounding.y + (elementBounding.y + elementBounding.height)) / 2

        if (checkXAxis(elementCentralX, centralDivBounding) && checkYAxis(elementCentralY, centralDivBounding)) {

            if (isAnswer) {

                element.target.style.display = 'none';
                document.getElementsByClassName('sa-success')[0].classList.toggle('hide');
                setTimeout(() => {
                    document.getElementsByClassName('sa-success')[0].classList.toggle('hide');

                    if (currentQuestion.rightAnswers <= nbRightAnswers + 1) {
                        nextQuestion();
                    } else {
                        nbRightAnswers += 1;
                    }
                }, 2000)

            } else {
                element.target.style.display = 'none';
            }
        }
    }

    const checkXAxis = (elementX, centralDivBounding) => {
        if (elementX > centralDivBounding.x && elementX < centralDivBounding.x + centralDivBounding.width) {
            return true
        }
        return false
    }

    const checkYAxis = (elementY, centralDivBoundind) => {
        if (elementY > centralDivBoundind.y && elementY < centralDivBoundind.y + centralDivBoundind.height) {
            return true
        }
        return false
    }



    useEffect(() => {
        setCentralDiv(document.getElementsByClassName('centralDiv')[0]);
        nbRightAnswers = 0;
    }, [isOver])

    const navigateToMenu = () => {
        history.push('/')
    }

    const restart = () => {
        setIndex(0);
        setCurrentQuestion(questions[0]);
        setIsOver(false);
    }

    return (
        <div className="containers">
            {isOver ? <>
                <div className="descriptionDiv">
                    <h1 className="bravoTitle">Bravo ! Tu as terminé !</h1>
                    <p className="bravoMessage">Tu peux revenir au menu ou recommencer</p>
                </div>
                <div className="navigation">
                    <div className="quitDivEnd">
                        <img src={home_menu} className="homeMenu" onClick={() => navigateToMenu()} />
                        {/* <Button type="primary" onClick={() => navigateToMenu()}> Quitter</Button> */}
                    </div>
                    <div className="restartDivEnd">
                        <img src={restarto} className="restart" onClick={() => restart()} />
                        {/* <Button type="primary" onClick={() => restart()}>Recommencer</Button> */}
                    </div>
                </div>
            </>
                :
                <>
                    <HeaderComponent />
                    <div className="quizGameCollab">
                        <div className="centralDiv">
                            <div className="check_mark">
                                <div className="sa-icon sa-success animate hide" style={style}>
                                    <span className="sa-line sa-tip animateSuccessTip"></span>
                                    <span className="sa-line sa-long animateSuccessLong"></span>
                                    <div className="sa-placeholder"></div>
                                    <div className="sa-fix"></div>
                                </div>
                            </div>
                            <p className='collabQuizDescription'>
                                {currentQuestion.description}</p>
                        </div>
                        {currentQuestion.pictures.map((item) => {
                            return (
                                <DraggableContainer key={Math.random()} src={item.src} isAnswer={item.isAnswer} onValidate={(element, isAnswer) => validatePosition(element, isAnswer)} />
                            )
                        })}
                    </div>
                </>
            }

        </div>
    );
};

export default QuizGameCollab;
