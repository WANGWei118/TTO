import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './QuizGameCollab.css'
import DraggableContainer from './individuel/DraggableContainer';
const imageTest = "https://previews.123rf.com/images/addtodsaporn/addtodsaporn1508/addtodsaporn150801134/43959862-dragon-fruit-isol%C3%A9-sur-fond-blanc-pitaya-fruit-.jpg"
const QuizGameCollab = props => {


    const [dragging, setDragging] = useState(false);
    const quiz = props.location.state.quiz.item;
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

    return (
        <div className="quizGameCollab">
            <div className="centralDiv"> <p className='collabQuizDescription'>{currentQuiz.description}</p></div>
            <DraggableContainer src={imageTest}></DraggableContainer>
        </div>
    );
};

QuizGameCollab.propTypes = {

};

export default QuizGameCollab;