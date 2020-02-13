import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

const QuizCardCollaborative = props => {

  const TANGIBLE = 'tangible'
  const NORMAL = 'normal'
  const url = 'http://192.168.182.29:10000/'

  const history = useHistory()
  const quiz = props.quiz
  const quizName = quiz.name
  const topic = quiz.topic

  const handleClick = (item) => {
    console.log(item)
    if (props.type === NORMAL) {
      history.push({
        pathname: '/quizCollabSupervisor',
        state: {quiz: {item}, type: NORMAL}
      })
    } else {
      history.push({
        pathname: '/quizCollabSupervisor',
        state: {quiz: {item}, type: TANGIBLE}
      })
    }
  }

  const defaultImage = () => {
    if (topic === 'animal') {
      return (
        <img src={'http://localhost:10000/assets/animals.jpg'}/>)
    } else {
      return (<img src={'http://localhost:10000/assets/Fruits.jpg'}/>)
    }
  }

  return (
    // <div className="quizCard" onClick={() => props.onClick()}>
    <div className="quizCard" onClick={() => handleClick(quiz)}>
      {quiz.src ? <img src={url + quiz.src}/> :
        defaultImage()
      }
      <h2 className="quizName">{quizName}</h2>
    </div>
  )
}

QuizCardCollaborative.propTypes = {}

export default QuizCardCollaborative
