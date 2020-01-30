import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

const QuizCardCollaborative = props => {

    const TANGIBLE = 'tangible';
    const NORMAL = 'normal';

    const history = useHistory();
    const quiz = props.quiz
    const quizName = quiz.name

    const handleClick = (item) => {
        console.log(item);
        if (props.type === NORMAL) {
            history.push({
                pathname: '/quizCollabSupervisor',
                state: { quiz: { item }, type: NORMAL }
            });
        } else {
            history.push({
                pathname: '/quizCollabSupervisor',
                state: { quiz: { item }, type: TANGIBLE }
            });
        }
    }

    return (
        // <div className="quizCard" onClick={() => props.onClick()}>
        <div className="quizCard" onClick={() => handleClick(quiz)}>
            <img src="https://image.shutterstock.com/image-photo/colorful-flower-on-dark-tropical-260nw-721703848.jpg" />
            <h2 className="quizName">{quizName}</h2>
        </div>
    )
};

QuizCardCollaborative.propTypes = {

};

export default QuizCardCollaborative;