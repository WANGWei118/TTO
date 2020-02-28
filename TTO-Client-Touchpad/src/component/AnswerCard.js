import React, { useState } from 'react'
import './AnswerCard.css'
import images from './images'
import { SERVER_URL } from '../constants.js';

const AnswerCard = (props) => {

  /**
  * Props
  */
  const answer = props.answer

  /**
   * redux
   */

  /**
   * States
   */

  const [hideClass, setHideClass] = useState('answerCard')


  const hideComponent = () => {
    if (props.canHide) {

      setHideClass(hideClass + ' hidden')
    }
  }

  // let imageToDisplay
  // images.forEach((item) => {
  //   if (answer.src === item.src) {
  //     imageToDisplay = item.title
  //   }
  // }
  // )
  return (
    <>
      <div className={hideClass} onClick={() => {
        props.onClick(answer)
        hideComponent()
      }}>
        <img className="answerCardImage" src={SERVER_URL + answer.src} />
        <h2 className="answerName">{answer.text}</h2>
      </div>
    </>
  )

}
export default AnswerCard
