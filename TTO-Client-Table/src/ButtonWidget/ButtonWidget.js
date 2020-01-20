import $ from 'jquery/dist/jquery.min'

import TUIOWidget from 'tuiomanager/core/TUIOWidget'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from 'tuiomanager/core/constants'
import { radToDeg } from 'tuiomanager/core/helpers'

class ButtonWidget extends TUIOWidget {
  constructor(x, y, width, height, text, socket) {
    super(x, y, width, height)
    this._domElem = $('<button></button>')
    this._domElem[0].innerText = text
    this.socket = socket
    this._domElem.css('width', `${width}px`)
    this._domElem.css('height', `${height}px`)
    this._domElem.css('position', 'absolute')
    this._domElem.css('left', `${x}px`)
    this._domElem.css('top', `${y}px`)
  }

  onClick() {
    this._domElem[0].addEventListener('click', () => {
      console.log(this._domElem[0].innerText)
      this.socket.sendBntMessage()
    })
  }

  get domElem() { return this._domElem }

  onTouchCreation(tuioTouch) {
    super.onTouchCreation(tuioTouch)
    if (this.isTouched(tuioTouch.x, tuioTouch.y)) {
      this._lastTouchesValues = {
        ...this._lastTouchesValues,
        [tuioTouch.id]: {
          x: tuioTouch.x,
          y: tuioTouch.y,
        },
      }
      // this.socketIo.sendBntMessage(this._domElem[0].innerText)
    }
  }

  /**
   * Call after a TUIOTouch update.
   *
   * @method onTouchUpdate
   * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
   */
  onTouchUpdate(tuioTouch) {
    if (typeof (this._lastTouchesValues[tuioTouch.id]) !== 'undefined') {
      const lastTouchValue = this._lastTouchesValues[tuioTouch.id]
      const diffX = tuioTouch.x - lastTouchValue.x
      const diffY = tuioTouch.y - lastTouchValue.y

      let newX = this.x + diffX
      let newY = this.y + diffY

      if (newX < 0) {
        newX = 0
      }

      if (newX > (WINDOW_WIDTH - this.width)) {
        newX = WINDOW_WIDTH - this.width
      }

      if (newY < 0) {
        newY = 0
      }

      if (newY > (WINDOW_HEIGHT - this.height)) {
        newY = WINDOW_HEIGHT - this.height
      }

      this.moveTo(newX, newY)
      this._lastTouchesValues = {
        ...this._lastTouchesValues,
        [tuioTouch.id]: {
          x: tuioTouch.x,
          y: tuioTouch.y,
        },
      }
    }
  }

  /**
   * Call after a TUIOTag creation.
   *
   * @method onTagCreation
   * @param {TUIOTag} tuioTag - A TUIOTag instance.
   */
  onTagCreation(tuioTag) {
    super.onTagCreation(tuioTag)
    if (this.isTouched(tuioTag.x, tuioTag.y)) {
      this._lastTagsValues = {
        ...this._lastTagsValues,
        [tuioTag.id]: {
          x: tuioTag.x,
          y: tuioTag.y,
        },
      }
    }
  }

  /**
   * Call after a TUIOTag update.
   *
   * @method onTagUpdate
   * @param {TUIOTag} tuioTag - A TUIOTag instance.
   */
  onTagUpdate(tuioTag) {
    if (typeof (this._lastTagsValues[tuioTag.id]) !== 'undefined') {
      const lastTagValue = this._lastTagsValues[tuioTag.id]
      const diffX = tuioTag.x - lastTagValue.x
      const diffY = tuioTag.y - lastTagValue.y

      let newX = this.x + diffX
      let newY = this.y + diffY

      if (newX < 0) {
        newX = 0
      }

      if (newX > (WINDOW_WIDTH - this.width)) {
        newX = WINDOW_WIDTH - this.width
      }

      if (newY < 0) {
        newY = 0
      }

      if (newY > (WINDOW_HEIGHT - this.height)) {
        newY = WINDOW_HEIGHT - this.height
      }

      this.moveTo(newX, newY, radToDeg(tuioTag.angle))
      this._lastTagsValues = {
        ...this._lastTagsValues,
        [tuioTag.id]: {
          x: tuioTag.x,
          y: tuioTag.y,
        },
      }
    }
  }

  /**
   * Move ImageWidget.
   *
   * @method moveTo
   * @param {string/number} x - New ImageWidget's abscissa.
   * @param {string/number} y - New ImageWidget's ordinate.
   * @param {number} angle - New ImageWidget's angle.
   */
  moveTo(x, y, angle = null) {
    this._x = x
    this._y = y
    this._domElem.css('left', `${x}px`)
    this._domElem.css('top', `${y}px`)
    if (angle !== null) {
      this._domElem.css('transform', `rotate(${angle}deg)`)
    }
  }
}

export default ButtonWidget
