import React, { useState } from 'react'
import './DraggableContainer.css'
import { SERVER_URL } from '../../constants.js';

const DraggableContainer = props => {

  const [x, setX] = useState(1 + Math.random() * (window.innerWidth * 0.80))
  const [y, setY] = useState(1 + Math.random() * (window.innerHeight * 0.40) + (window.innerHeight * 0.50))

  const [previousCursorPosX, setPreviousCursorPosX] = useState(0)
  const [previousCursorPosY, setPreviousCursorPosY] = useState(0)
  const [dragging, setDragging] = useState(false)

  const handleMouseMove = (e) => {
    e.preventDefault()
    if (dragging) {

      setX(x + e.screenX - previousCursorPosX)
      setY(y + e.screenY - previousCursorPosY)

      setPreviousCursorPosX(e.screenX)
      setPreviousCursorPosY(e.screenY)
    }
  }

  const handleTouchMove = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (dragging) {

      setX(x + e.touches[0].clientX - previousCursorPosX)
      setY(y + e.touches[0].clientY - previousCursorPosY)

      setPreviousCursorPosX(e.touches[0].clientX)
      setPreviousCursorPosY(e.touches[0].clientY)

    }
  }

  const handleMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.screenX) {
      setPreviousCursorPosX(e.screenX)
      setPreviousCursorPosY(e.screenY)
    } else {
      setPreviousCursorPosX(e.touches[0].clientX)
      setPreviousCursorPosY(e.touches[0].clientY)
    }
    setDragging(true)
  }

  const handleMouseUp = (e) => {
    setDragging(false)
  }
  return (
    <div>
      <img className='draggableImage' draggable src={SERVER_URL + props.src} style={{ position: 'absolute', left: x, top: y }}
        onMouseMove={(e) => handleMouseMove(e)}
        onTouchMove={(e) => handleTouchMove(e)}
        onMouseDown={(e) => handleMouseDown(e)}
        onTouchStart={(e) => handleMouseDown(e)}
        onMouseUp={(e) => {
          props.onValidate(e, props.isAnswer)
          handleMouseUp(e)
        }}
        onTouchEnd={(e) => {
          props.onValidate(e, props.isAnswer)
          handleMouseUp(e)
        }}></img>
      {/* <h2>{props.name}</h2> */}
    </div>
  )
}

export default DraggableContainer
