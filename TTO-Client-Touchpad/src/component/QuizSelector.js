import React, { Component } from 'react';
import QuizCard from './QuizCard';
import './QuizSelector.css';
import openSocket from 'socket.io-client';

class QuizSelector extends Component {
    socket = openSocket;
    quizList = [];

    constructor(props) {
        super(props);
        this.socket = props.socket
        this.state = { loading: true, data: null };

        this.socket.on('all quizz', (result) => {
            this.quizList = result;
            this.setState({ loading: false, data: result })
        })
    }

    renderList = data => {
        console.log(data);
        return (
            <>
                {data.map((item) => {
                    return (
                        <QuizCard key={item._id} quiz={item} />
                    )
                })}
            </>
        )
    }

    componentDidMount() {
        this.socket.emit('get quizz');
    }

    render() {
        const { loading, data } = this.state;
        return (
            <div>
                <h1 className="pageTitle">Selectionner un Quiz</h1>
                <div className="randomQuiz"></div>
                {loading ? 'Classic loading placeholder' : this.renderList(data)}
            </div>
        )
    }
}


export default QuizSelector;
