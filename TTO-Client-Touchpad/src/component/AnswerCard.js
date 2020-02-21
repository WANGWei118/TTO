import React, { useState } from 'react'
import './AnswerCard.css'
import images from './images'
import {SERVER_URL} from '../constants.js';

const AnswerCard = (props) => {
  const [hide, setHide] = useState(false)
  const [hideClass, setHideClass] = useState('answerCard')
  const answer = props.answer

  const hideComponent = () => {
    if (props.canHide) {

      setHideClass(hideClass + ' hidden')
    }
  }

  let imageToDisplay
  images.forEach((item) => {
      if (answer.src === item.src) {
        imageToDisplay = item.title
      }
    }
  )
  return (
    <>
      <div className={hideClass} onClick={() => {
        props.onClick(answer)
        hideComponent()
      }}>
        <img className="answerCardImage" src={SERVER_URL + answer.src}/>
        <h2 className="answerName">{answer.text}</h2>
      </div>
    </>
  )

}
export default AnswerCard
