import React, { useState } from 'react'
import './AnswerCard.css'
import images from './images'

const url = 'http://192.168.43.223:10000/'

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
        <img className="answerCardImage" src={url + answer.src}/>
        <h2 className="answerName">{answer.text}</h2>
      </div>
    </>
  )

}
export default AnswerCard
