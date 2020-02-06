import React from 'react';
import './Menu.css';
import openSocket from 'socket.io-client';
import { Button } from 'antd';
import "antd/dist/antd.css";
import { useHistory } from "react-router-dom";

function Menu(props) {
    const socket = props.socket

    let history = useHistory();

    function selectQuiz() {
        // let path = 'quiz'
        let path = 'selectAccueilli'
        history.push(path);
    }
    socket.on('welcome', (data) => {
        console.log(data);
    })
    socket.on('message received', (data) => {
        console.log(data);
    })

    socket.on('quizz', (data) => {
        console.log(data);
    })

    const selectQuizCollaboratif = () => {
        const path = '/quizSelectorCollab'
        history.push(path)
    }

    return (
        <div className="divMenu">
            <h1>TTO</h1>
            <div className="menuButton">
                <Button type="primary" className="startQuiz" onClick={() => selectQuiz()}>Lancer un quiz individuel</Button>
            </div>
            <div className="menuButton" >
                <Button type="primary" onClick={selectQuizCollaboratif}>Liste quiz collaboratif</Button>
            </div>
        </div>
    );
}

export default Menu;
