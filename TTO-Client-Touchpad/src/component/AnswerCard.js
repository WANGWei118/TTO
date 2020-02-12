import React, { useState } from 'react'
import './AnswerCard.css'
import images from './images'

const url = 'http://localhost:10000/'

const AnswerCard = (props) => {
  const [hide, setHide] = useState(false)
  const answer = props.answer

  const hideComponent = () => {
    if (props.canHide) {
      setHide(true)
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
      {hide ? <></> :
        <div className="answerCard" onClick={() => {
          props.onClick(answer)
          hideComponent()
        }}>
          <img className="answerCardImage" src={url + answer.src}/>
          {/* <h2 className="answerName">{answer.text}</h2> */}
        </div>
      }
    </>
  )
}

export default AnswerCard
