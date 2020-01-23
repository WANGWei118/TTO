import React from 'react';
import './Menu.css';
import openSocket from 'socket.io-client';
import { Button } from 'antd';
import "antd/dist/antd.css";
import { useHistory } from "react-router-dom";
const socket = openSocket('http://localhost:10000');

function Menu() {

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

    function addQuiz() {
        const quiz = {
            "id": 1,
            "name": "Premier Quiz",
            "topic": "Fruit",
            "questions": [
                {
                    "id": 1,
                    "description": "Quel fruit est rouge?",
                    "answers": [
                        {
                            "id": "A",
                            "text": "Pomme",
                            "src": "https://sf1.viepratique.fr/wp-content/uploads/sites/5/2014/10/shutterstock_102978833.jpg"
                        },
                        {
                            "id": "B",
                            "text": "Banana",
                            "src": "https://o1.ldh.be/image/thumb/59b9261fcd703b65924f0e26.jpg"
                        },
                        {
                            "id": "C",
                            "text": "Bean",
                            "src": "https://sweetcsdesigns.com/wp-content/uploads/2017/06/The-Best-Way-To-Make-Pinto-Beans-Ever84-720x720.jpg"
                        },
                        {
                            "id": "D",
                            "text": "Orange",
                            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Orange_and_cross_section.jpg/440px-Orange_and_cross_section.jpg"
                        }
                    ],
                    "rightAnwer": {
                        "id": "A",
                        "text": "Pomme",
                        "src": "https://github.com/WANGWei118/TTO/blob/master/images/apple.jpg"
                    },
                    "explains": "Pomme est rouge, banane est jeune......"
                },
                {
                    "id": 2,
                    "description": "Quel fruit est Jaune?",
                    "answers": [
                        {
                            "id": "A",
                            "text": "Pomme",
                            "src": "https://github.com/WANGWei118/TTO/blob/master/images/apple.jpg"
                        },
                        {
                            "id": "B",
                            "text": "Banana",
                            "src": "https://github.com/WANGWei118/TTO/blob/master/images/bananes.jpg"
                        },
                        {
                            "id": "C",
                            "text": "Bean",
                            "src": "https://github.com/WANGWei118/TTO/blob/master/images/bean.jpg"
                        },
                        {
                            "id": "D",
                            "text": "Orange",
                            "src": "https://github.com/WANGWei118/TTO/blob/master/images/orange.jpg"
                        }
                    ],
                    "rightAnwer": {
                        "id": "B",
                        "text": "Banana",
                        "src": "https://github.com/WANGWei118/TTO/blob/master/images/bananes.jpg"
                    },
                    "explains": "Oui ! La banane est jaune"
                }
            ]
        }

        socket.emit("add quiz", quiz);
    }
    return (

        <div className="divMenu">


            <h1>Titre de l'application</h1>
            <div className="menuButton">
                <Button type="primary" className="startQuiz" onClick={() => selectQuiz()}>Lancer un quiz</Button>
            </div>
            <div className="menuButton" >
                <Button type="primary" onClick={addQuiz}>Suivi</Button>
            </div>
        </div>
    );
}

export default Menu;