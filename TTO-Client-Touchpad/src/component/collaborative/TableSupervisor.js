import React, { useState } from 'react';
import PropTypes from 'prop-types';

const TableSupervisor = props => {
    const socket = props.socket;

    const quiz = props.location.state.quiz.testTableQuiz

    const [index, setIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(quiz[index]);

    const handleNextQuestion = () => {
        setIndex(index + 1);
        setCurrentQuestion(quiz[index]);
        socket.emit('nextQuestion', currentQuestion);
    }


    return (
        <div>
            <button onClick={() => handleNextQuestion()}>Question suivante</button>
        </div>
    );
};

TableSupervisor.propTypes = {

};

export default TableSupervisor;