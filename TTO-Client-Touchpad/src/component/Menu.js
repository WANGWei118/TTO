import React from 'react';
import './Menu.css';
import openSocket from 'socket.io-client';
import { Button } from 'antd';
import "antd/dist/antd.css";
import { useHistory } from "react-router-dom";
import TouchBackend from 'react-dnd-touch-backend'
import { DndProvider, useDrag } from 'react-dnd'
import DndDraggable from './DndDraggable';
function Menu(props) {
    const socket = props.socket

  let history = useHistory()

  function selectQuiz () {
    // let path = 'quiz'
    let path = 'selectAccueilli'
    console.log('ok')
    history.push(path)
  }

  const selectQuizCollaboratif = () => {
    const path = '/quizSelectorCollab'
    history.push(path)
  }

  return (
    <div className="divMenu">
      <h1 className="mainTitle">TOT</h1>
      <div className="menuButton">
        <Button type="primary" className="startQuiz" onClick={() => selectQuiz()}>Lancer un quiz individuel</Button>
      </div>
      <div className="menuButton">
        <Button type="primary" className="startQuiz" onClick={selectQuizCollaboratif}>Lancer un quiz
          collaboratif</Button>
      </div>
    </div>
  )
}

export default Menu
