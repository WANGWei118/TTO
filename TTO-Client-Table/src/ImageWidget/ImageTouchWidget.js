/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

// Import JQuery
import $ from 'jquery/dist/jquery.min'

import TUIOWidget from 'tuiomanager/core/TUIOWidget'
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'tuiomanager/core/constants'
import { radToDeg } from 'tuiomanager/core/helpers'

/**
 * Main class to manage ImageWidget.
 *
 * Note:
 * It's dummy implementation juste to give an example
 * about how to use TUIOManager framework.
 *
 * @class ImageWidget
 * @extends TUIOWidget
 */
class ImageTouchWidget extends TUIOWidget {
  /**
   * ImageWidget constructor.
   *
   * @constructor
   * @param {number} x - ImageWidget's upperleft coin abscissa.
   * @param {number} y - ImageWidget's upperleft coin ordinate.
   * @param {number} width - ImageWidget's width.
   * @param {number} height - ImageWidget's height.
   * @param imgSrc
   * @param socket
   */

  constructor (x, y, width, height, imgSrc, socket, isRight, rightNum) {
    super(x, y, width, height)
    this._lastTouchesValues = {}
    this._lastTagsValues = {}
    this.socket = socket
    this.isRight = isRight
    this.rightNums = rightNum
    this._domElem = $('<img>')
    this._domElem.attr('src', `${imgSrc}`)
    this._domElem.css('width', `${width}px`)
    this._domElem.css('height', `${height}px`)
    this._domElem.css('position', 'absolute')
    this._domElem.css('left', `${x}px`)
    this._domElem.css('top', `${y}px`)

    this.socket._client.on('all tableQuiz', () => {
      console.log('asdfjlasjdflkjasdlkfjlas')
    })
  }

  /**
   * ImageWidget's domElem.
   *
   * @returns {JQuery Object} ImageWidget's domElem.
   */
  get domElem () { return this._domElem }

  onTouchCreation(tuioTouch) {
    super.onTouchCreation(tuioTouch)
    console.log('sdfsdf')
    if (this.isTouched(tuioTouch.x, tuioTouch.y)) {
      this._lastTouchesValues = {
        ...this._lastTouchesValues,
        [tuioTouch.id]: {
          x: tuioTouch.x,
          y: tuioTouch.y,
        },
      }
      console.log('sdfsdf')
      if(this.isRight) {
        this._domElem.css('display', `none`)
        this.socket.sendValidedAction(true)
        var bravo = document.createElement('h1')
        bravo.setAttribute('class', 'information')
        bravo.innerText = 'Bravo'
        console.log('bravo')
        $('.imageDiv').append(bravo)
        setTimeout(()=>{
          $('.information').css('display', `none`)
        }, 1000)
      }else{
        this._domElem.css('display', `none`)
        this.socket.sendValidedAction(false)
        var again = document.createElement('h1')
        again.setAttribute('class', 'information')
        again.innerText = 'Essayez encore'
        $('.imageDiv').append(again)
        console.log('essayez-encore')
        setTimeout(()=>{
          $('.information').css('display', `none`)
        }, 1000)
      }
    }
  }

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
    }
  }

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
      if(this.isRight) {
        this.socket.sendValidedAction(true)
        this._domElem.css('display', `none`)
        var bravo = document.createElement('h1')
        bravo.setAttribute('class', 'information')
        bravo.innerText = 'Bravo'
        console.log('bravo')
        $('.imageDiv').append(bravo)
        setTimeout(()=>{
          $('.information').css('display', `none`)
        }, 1000)
      }else{
        this.socket.sendValidedAction(false)
        this._domElem.css('display', `none`)
        var again = document.createElement('h1')
        again.setAttribute('class', 'information')
        again.innerText = 'Essayez encore'
        $('.imageDiv').append(again)
        console.log('essayez-encore')
        setTimeout(()=>{
          $('.information').css('display', `none`)
        }, 1000)
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

    }
  }

}

export default ImageTouchWidget
