import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, Result, Icon, } from 'antd'


const TableSupervisor = props => {
  // const TANGIBLE = 'tangible'
  // const NORMAL = 'normal'

  const socket = props.socket
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

  const handleNextQuestion = () => {
    if (questions.length > index) {
      console.log("type:")
      console.log(quiz.type)

      socket.emit('next question', questions[index + 1], { type: quiz.type })
      setCurrentQuestion(questions[index + 1])
      setIndex(index + 1)
    } else {
      // The quizz is over
    }

  }

  useEffect(() => {
    if (quiz.type === 'handsMove') {
      socket.emit('lancer quiz collaborative', currentQuestion)
    } else if (quiz.type === 'handsTouch') {
      socket.emit('lancer quiz tangible', currentQuestion)

    }
    else {
      socket.emit('start fun quiz', { src: quiz.src })
    }
  }, [])

  return (
    <div>
      <Result
        icon={<Icon type="smile" theme="twoTone" />}
        title="C'est leur bon moment!"
        extra={<Button type="primary" onClick={() => handleNextQuestion()}>Question suivante</Button>}
      />
    </div>
  )
}

TableSupervisor.propTypes = {}

export default TableSupervisor
