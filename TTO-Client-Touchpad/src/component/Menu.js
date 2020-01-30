import React from 'react';
import './Menu.css';
import openSocket from 'socket.io-client';
import { Button } from 'antd';
import "antd/dist/antd.css";
import { useHistory } from "react-router-dom";
// const socket = openSocket('http://10.212.107.151:10000');

function Menu(props) {
    const socket = props.socket
    const testTableQuiz = [{
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
    },
    {
        "id": 2,
        "description": "Mettez les Bananes au milieu",
        "pictures": [
            {
                "description": "pomme",
                "src": "assets/apple.jpg",
                "isAnswer": false
            },
            {
                "description": "banana",
                "src": "assets/bananes.png",
                "isAnswer": true
            }
        ]
    }];
    let history = useHistory();

    function selectQuiz() {
        let path = 'quiz'
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

    const launchTableGame = () => {
        socket.emit('lancer quiz collaborative', testTableQuiz[0]);

        let path = 'quizCollab';
        history.push({
            pathname: '/quizCollab',
            state: { quiz: { testTableQuiz } }
        });
    }

    const launchTableGameTangible = () => {
        socket.emit('lancer quiz tangible', testTableQuiz[0]);

        let path = 'quizCollab';
        history.push({
            pathname: '/quizCollab',
            state: { quiz: { testTableQuiz } }
        });
    }

    return (
        <div className="divMenu">
            <h1>Titre de l'application</h1>
            <div className="menuButton">
                <Button type="primary" className="startQuiz" onClick={() => selectQuiz()}>Lancer un quiz individuel</Button>
            </div>
            <div className="menuButton" >
                <Button type="primary" onClick={launchTableGame}>Lancer un quiz collaboratif</Button>
            </div>
            <div className="menuButton" >
                <Button type="primary" onClick={launchTableGameTangible}>Lancer un quiz collaboratif</Button>
            </div>
        </div>
    );
}

export default Menu;
