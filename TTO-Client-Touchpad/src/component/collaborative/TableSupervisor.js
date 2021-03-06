import React, { useState, useEffect } from 'react'
import { Button, Result, Icon, Card, } from 'antd'
import HeaderComponent from '../HeaderComponent'
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



  const dispatch = useDispatch();
  const history = useHistory();
  /**
  * Props or constants
  */

  const socket = props.socket
  console.log(props.location.state);
  const quiz = props.location.state.quiz.item
  let questions = [];

  if (quiz.type !== 'music') {
    questions = quiz.questions
  }

  /**
   * States for the game played
   * 
   */

  const [isAtLastQuestion, setIsAtLastQuestion] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(questions[0])

  /**
   * 
   * States for accueilli monitoring
   */

  const [accueillisPlaying, setAccueillisPlaying] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [tempAccueilliAdded, setTempsAccueilliAdded] = useState(null);
  const [selectedAccueilli, setSelectedAccueilli] = useState(null);






  // Tells if the current question is over in the table

  const navigateToMenu = () => {
    history.push('/')
  }

  const restart = () => {
    setIndex(0);
    setIsAtLastQuestion(false);
    setQuizStarted(false);
    setCurrentQuestion(questions[0]);
  }

  console.log("CurrentQuestion : ")
  console.log(currentQuestion)

  const handleNextQuestion = () => {
    if (questions.length > index) {
      socket.emit('next question', questions[index + 1], { type: quiz.type })
      setCurrentQuestion(questions[index + 1])
      setIndex(index + 1)
      if (questions.length <= index + 1) {

        setIsAtLastQuestion(true);
        socket.emit("table quiz finished");

      }
    } else {
      // The quizz is over or at last question
      setIsAtLastQuestion(true);
      socket.emit("table quiz finished");
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
      {showFeedback ? <AccueilliFeedback accueilli={selectedAccueilli} images={currentQuestion ? currentQuestion.pictures : []} cancelFeedback={() => cancelFeedback()} okFeedback={() => okFeedback()} /> : <></>}
    </>
  )
}

export default TableSupervisor
