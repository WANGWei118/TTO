import TUIOWidget from 'tuiomanager/core/TUIOWidget'
import $ from 'jquery/dist/jquery.min'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from 'tuiomanager/core/constants'

let des = ''
let validedAnswers = 0
const url = 'http://172.20.10.2:10000/'
let isTouched = false

class DivWidget extends TUIOWidget {
  constructor (x, y, width, height, socket, played, audioSrc, count) {
    super(x, y, width, height)
    this.socket = socket
    this.count = count
    this._domElem = $('<div></div>')
    this._domElem.css('width', `${width}px`)
    this._domElem.css('height', `${height}px`)
    this._domElem.css('position', 'absolute')
    this._domElem.css('left', `${x}px`)
    this._domElem.css('top', `${y}px`)
    this._domElem.css('fontSize', `50px`)
    this.audio = new Audio(url + audioSrc)
    this.played = played
    this._domElem[0].className = 'name' + this.count.toString()
    isTouched = false
  }

  get domElem () { return this._domElem }

  /**
   * Call after a TUIOTouch creation.
   *
   * @method onTouchCreation
   * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
   */
  onTouchCreation (tuioTouch) {
    super.onTouchCreation(tuioTouch)
    if (this.isTouched(tuioTouch.x, tuioTouch.y)) {
      this._lastTouchesValues = {
        ...this._lastTouchesValues,
        [tuioTouch.id]: {
          x: tuioTouch.x,
          y: tuioTouch.y,
        },
      }
      console.log('hello world')
      if (!isTouched) {
        isTouched = true
        this.socket.playMusic()
        $('.' + this._domElem[0].className).fadeOut(500)
      }
    }
  }

  /**
   * Call after a TUIOTouch update.
   *
   * @method onTouchUpdate
   * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
   */
  // onTouchUpdate (tuioTouch) {
  //   if (typeof (this._lastTouchesValues[tuioTouch.id]) !== 'undefined') {
  //     const lastTouchValue = this._lastTouchesValues[tuioTouch.id]
  //     const diffX = tuioTouch.x - lastTouchValue.x
  //     const diffY = tuioTouch.y - lastTouchValue.y
  //
  //     let newX = this.x + diffX
  //     let newY = this.y + diffY
  //
  //     if (newX < 0) {
  //       newX = 0
  //     }
  //
  //     if (newX > (WINDOW_WIDTH - this.width)) {
  //       newX = WINDOW_WIDTH - this.width
  //     }
  //
  //     if (newY < 0) {
  //       newY = 0
  //     }
  //
  //     if (newY > (WINDOW_HEIGHT - this.height)) {
  //       newY = WINDOW_HEIGHT - this.height
  //     }
  //
  //     // this.moveTo(newX, newY)
  //     // this._lastTouchesValues = {
  //     //   ...this._lastTouchesValues,
  //     //   [tuioTouch.id]: {
  //     //     x: tuioTouch.x,
  //     //     y: tuioTouch.y,
  //     //   },
  //     // }
  //   }
  // }

}

export default DivWidget
