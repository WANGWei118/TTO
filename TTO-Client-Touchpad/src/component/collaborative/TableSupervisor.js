import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const TableSupervisor = props => {
    const TANGIBLE = 'tangible';
    const NORMAL = 'normal';

    const socket = props.socket;
    console.log(props)

    const quiz = props.location.state.quiz.item;
    const questions = quiz.questions;

    const [index, setIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(questions[index]);


    const handleNextQuestion = () => {
        setIndex(index + 1);
        setCurrentQuestion(questions[index]);
        socket.emit('next question', currentQuestion);
    }

    useEffect(() => {
        if (quiz.type === 'notangible') {
            socket.emit('lancer quiz collaborative', currentQuestion);
        } else {
            socket.emit('lancer quiz tangible', currentQuestion);
        }
    }, [])

    return (
        <div>
            <button onClick={() => handleNextQuestion()}>Question suivante</button>
        </div>
    );
};

TableSupervisor.propTypes = {

};

export default TableSupervisor;