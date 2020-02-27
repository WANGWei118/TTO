import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, Result, Icon, Card, } from 'antd'
import HeaderComponent from '../HeaderComponent'
import TouchBackend from 'react-dnd-touch-backend';
import { DndProvider } from 'react-dnd';
import './TableSupervisor.css';
import Meta from 'antd/lib/card/Meta';
import { SERVER_URL } from '../../constants.js';
import AccueilliModal from './AccueilliModal';
import { useDispatch } from 'react-redux';
import AccueilliFeedback from './AccueilliFeedback';
import { useHistory } from 'react-router-dom';
const home_menu = require('./../../assets/home_menu.png')
const restarto = require('./../../assets/reload_icon.jpg')

const TableSupervisor = props => {
  // const TANGIBLE = 'tangible'
  // const NORMAL = 'normal'

  const [accueillisPlaying, setAccueillisPlaying] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const socket = props.socket
  const [tempAccueilliAdded, setTempsAccueilliAdded] = useState(null);
  const dispatch = useDispatch();
  const [selectedAccueilli, setSelectedAccueilli] = useState(null);
  const [isAtLastQuestion, setIsAtLastQuestion] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const history = useHistory();

  console.log(props.location.state);
  const quiz = props.location.state.quiz.item
  let questions = [];
  if (quiz.type !== 'music') {
    questions = quiz.questions
  }

  const [index, setIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(questions[index])

  // Tells if the current question is over in the table
  const [isQuestionOver, setIsQuestionOver] = useState(false)

  const navigateToMenu = () => {
    history.push('/')
  }

  const restart = () => {
    setIndex(0);
    setCurrentQuestion(questions[0]);
    setIsAtLastQuestion(false);
    setQuizStarted(false);
    setCurrentQuestion(questions[0]);
  }



  const handleNextQuestion = () => {
    if (questions.length > index) {
      console.log("type:")
      console.log(quiz.type)
      socket.emit('next question', questions[index + 1], { type: quiz.type })
      setCurrentQuestion(questions[index + 1])
      setIndex(index + 1)
      if (questions.length <= index + 1) {
        setIsAtLastQuestion(true);
        socket.emit("quiz finished");
      }
    } else {
      // The quizz is over or at last question
      socket.emit("quiz finished");
    }

  }

  useEffect(() => {
    // if (quiz.type === 'handsMove') {
    //   socket.emit('lancer quiz collaborative', currentQuestion)
    // } else if (quiz.type === 'handsTouch') {
    //   socket.emit('lancer quiz tangible', currentQuestion)

    // }
    // else {
    //   console.log(quiz);
    //   socket.emit('start fun quiz', { src: quiz.src })
    // }
  }, [])

  useEffect(() => {
    socket.on('all profiles', (item) => {
      console.log(item)
      dispatch({ type: 'list_accueilli', accueilliList: { item } })
    })
    socket.emit('get profiles')

    return () => {
      socket.off('all profiles')
    }
  }, [])

  const startQuiz = () => {
    setQuizStarted(true);
    if (quiz.type === 'handsMove') {
      socket.emit('lancer quiz collaborative', currentQuestion)
    } else if (quiz.type === 'handsTouch') {
      socket.emit('lancer quiz tangible', currentQuestion)
    }
    else {
      console.log(quiz);
      socket.emit('start fun quiz', { src: quiz.src })
    }
  }

  const openModal = () => {
    setShowModal(true);
  }

  const okFeedback = () => {
    setShowFeedback(false)
  }

  const cancelFeedback = () => {
    setShowFeedback(false)
  }

  const onSelectionChange = (accueilli) => {
    setTempsAccueilliAdded(accueilli)
  }

  const openAccueilliFeedback = (accueilli) => {
    setShowFeedback(true);
    setSelectedAccueilli(accueilli);
  }

  const handleCancel = () => {
    setTempsAccueilliAdded(null);
    setShowModal(false);
  }
  const handleOk = () => {
    if (tempAccueilliAdded !== null) {
      setAccueillisPlaying([...accueillisPlaying, tempAccueilliAdded]);
    }
    setShowModal(false);
  }



  return (
    <>

      <div className="gameSupervisor">
        <HeaderComponent title="" />
        {!quizStarted ?
          <Result
            icon={<Icon type="smile" theme="twoTone" />}
            title="C'est l'heure de jouer sur la table!"
            extra={
              <Button type="primary" onClick={() => startQuiz()}>Commencer le quiz !</Button>
            }
          /> :
          !isAtLastQuestion ?
            <Result
              icon={<Icon type="smile" theme="twoTone" />}
              title={`Jeu ${index + 1}/${questions.length}`}
              extra={
                <Button type="primary" onClick={() => handleNextQuestion()}>Question suivante</Button>
              }
            />
            :
            <Result
              status="success"
              title="Bravo ! Le quiz est terminé !"
              extra={[
                <>

                  <img src={home_menu} alt="Retourner au menu" className="homeMenuTable" onClick={() => navigateToMenu()} />

                  <img src={restarto} alt="Recommencer le quiz" className="restartTable" onClick={() => restart()} />
                </>

              ]
              }
            />
        }

      </div>
      <div className="accueillisSupervisor">
        {accueillisPlaying.map((accueilli) => {
          return <div className="accueilliCardSupervisor">
            <Card hoverable
              onClick={() => openAccueilliFeedback(accueilli)}
              cover={<img className="accueilliImageSupervisor" src={SERVER_URL + accueilli.src} />}
            >
              <Meta className="metaCard" title={accueilli.firstName} />
            </Card>
          </div>
        })}
        <div className="uploadDiv" onClick={() => openModal()}>
          <Icon type='plus' />
          <div className="ant-upload-text">Accueilli</div>
        </div>
        {showModal ? <AccueilliModal onSelectionChange={(e) => onSelectionChange(e.target.value)} handleCancel={() => handleCancel()} handleOk={() => handleOk()} /> : <></>}
      </div>
      {showFeedback ? <AccueilliFeedback accueilli={selectedAccueilli} images={currentQuestion.pictures} cancelFeedback={() => cancelFeedback()} okFeedback={() => okFeedback()} /> : <></>}
    </>
  )
}

TableSupervisor.propTypes = {}

export default TableSupervisor
