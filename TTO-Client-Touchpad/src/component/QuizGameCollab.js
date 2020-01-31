import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './QuizGameCollab.css'
import DraggableContainer from './individuel/DraggableContainer';
const imageTest = "https://previews.123rf.com/images/addtodsaporn/addtodsaporn1508/addtodsaporn150801134/43959862-dragon-fruit-isol%C3%A9-sur-fond-blanc-pitaya-fruit-.jpg"
const QuizGameCollab = props => {


    const quiz = props.location.state.quiz.item;
    const questions = quiz.questions;

    const [dragging, setDragging] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(questions[0]);

    const currentQuiz =
    {
        "id": 1,
        "description": "Mettez les pommes au milieu",
        "pictures": [
            {
                "description": "pomme",
                "src": "assets/apple.jpg",
                "isAnswer": true
            },
            {
                "description": "banana",
                "src": "assets/bananes.png",
                "isAnswer": false
            }
        ]
    };

    const renderImage = (item) => {
        console.log(item)

    }

    return (
        <div className="quizGameCollab">
            <div className="centralDiv"> <p className='collabQuizDescription'>{currentQuiz.description}</p></div>
            {currentQuestion.pictures.map((item) => {
                return (
                    <DraggableContainer key={item} src={imageTest} />
                )
            })}
        </div>
    );
};

QuizGameCollab.propTypes = {

};

export default QuizGameCollab;