import React, { Component } from 'react';
import QuizCard from './QuizCard';
import './QuizSelector.css';
import openSocket from 'socket.io-client';

import { Tabs, Spin } from 'antd';

const { TabPane } = Tabs;
const INDIVIDUAL_TYPE = 'individual';
const COLLAB_TYPE = 'collaborative';


class QuizSelector extends Component {
    socket = openSocket;
    quizList = [];

    constructor(props) {
        super(props);
        this.socket = props.socket
        this.state = { loadingIndividual: true, loadingCollab: true, individualQuiz: null, collabQuiz: null };

        this.socket.on('all quizz', (result) => {
            this.quizList = result;
            this.setState({ loadingIndividual: false, individualQuiz: result })
        })

        this.socket.on('all tableQuiz', (result) => {
            console.log('all tableQuiz');
            this.setState({ loadingCollab: false, collabQuiz: result })
        });

        this.socket.on('get all types quiz', (result) => {
            console.log(result);
        });
    }

    renderList = (data, type) => {
        return (
            <>
                {data.map((item) => {
                    return (
                        <QuizCard key={item._id} quiz={item} type={type} />
                    )
                })}
            </>
        )
    }

    componentDidMount() {
        this.socket.emit('get quizz', { type: "tablet" });
        this.socket.emit('get quizz', { type: 'table' });
        this.socket.emit('get all types quiz');
    }



    render() {
        const { loadingIndividual, loadingCollab, individualQuiz, collabQuiz } = this.state;
        return (
            <div>
                <h1 className="pageTitle">Selectionner un Quiz</h1>
                <div className="randomQuiz"></div>
                <Tabs defaultActiveKey="1" type="card">
                    <TabPane tab="Selectionner une réponse" key="1">
                        {loadingIndividual ? <Spin tip="Chargement" ></Spin> : this.renderList(individualQuiz, INDIVIDUAL_TYPE)}

                    </TabPane>
                    <TabPane tab="Mettre les réponses au centre" key="2">
                        {loadingCollab ? <Spin tip="Chargement" ></Spin> : this.renderList(collabQuiz, COLLAB_TYPE)}
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default QuizSelector;
