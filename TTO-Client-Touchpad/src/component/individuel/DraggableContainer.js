import React, { useState } from 'react'
import './DraggableContainer.css'

const DraggableContainer = props => {
  const url = 'http://192.168.1.7:10000/'

  const [x, setX] = useState(1 + Math.random() * (window.innerWidth * 0.80))
  const [y, setY] = useState(window.innerHeight * 0.80)

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
    if (dragging) {

      setX(x + e.touches[0].clientX - previousCursorPosX)
      setY(y + e.touches[0].clientY - previousCursorPosY)

      setPreviousCursorPosX(e.touches[0].clientX)
      setPreviousCursorPosY(e.touches[0].clientY)

    }
  }

  const handleMouseDown = (e) => {
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
      <img className='draggableImage' draggable src={url + props.src} style={{ position: 'absolute', left: x, top: y }}
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
