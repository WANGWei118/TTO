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
const windowsWidth = $(window).width()
const windowsHeight = $(window).height()

class ImageWidget extends TUIOWidget {
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

  constructor (x, y, width, height, imgSrc, socket, isRight, rightNum,
               i) {
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
    this.vanished = false

    this._domElem[0].className = 'name' + i.toString()

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

  /**
   * Call after a TUIOTouch creation.
   *
   * @method onTouchCreation
   * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
   */
  onTouchCreation (tuioTouch) {
    super.onTouchCreation(tuioTouch)
    if (this.isTouched(tuioTouch.x, tuioTouch.y)) {
      console.log(tuioTouch.x, tuioTouch.y)
      this._lastTouchesValues = {
        ...this._lastTouchesValues,
        [tuioTouch.id]: {
          x: tuioTouch.x,
          y: tuioTouch.y,
        },
      }
    }
  }

  onTouchDeletion (tuioTouchId) {
    super.onTouchDeletion(tuioTouchId)

    if (!this.vanished) {
      if (this._x >= 499 && this._x <= 1428
        && this._y >= 283 && this._y <= 788 && this.isRight === true) {
        this.socket.sendValidedAction(true)
        for (let i = 0; i < 4; i++) {
          var bravo = document.createElement('h1')
          bravo.setAttribute('class', 'information' + i.toString())
          bravo.innerText = 'Bravo'
          $('.nonTangibleDiv').remove($('.information0'), $('.information1'),$('.information2'),$('.information3'))
            .append(bravo)
        }
        this.vanished = true
        console.log('bravo')
        setTimeout(() => {
          $('.' + this._domElem[0].className).fadeOut(500)
          // $('.testImage').remove()
          $('.information0').fadeOut(500)
          $('.information1').fadeOut(500)
          $('.information2').fadeOut(500)
          $('.information3').fadeOut(500)
        }, 500)
      }
      if (this._x >= 499 && this._x <= 1428
        && this._y >= 283 && this._y <= 788 && this.isRight === false) {
        this.socket.sendValidedAction(false)
        for (let i = 0; i < 4; i++) {
          var again = document.createElement('h1')
          again.setAttribute('class', 'information' + i.toString())
          again.innerText = 'Essayez encore'
          $('.nonTangibleDiv').remove($('.information0'), $('.information1'),$('.information2'),$('.information3'))
            .append(again)
        }
        console.log('essayez-encore')
        this.vanished = true
        setTimeout(() => {
          $('.' + this._domElem[0].className).fadeOut(500)
          // $('.testImage').remove()
          $('.information0').fadeOut(500)
          $('.information1').fadeOut(500)
          $('.information2').fadeOut(500)
          $('.information3').fadeOut(500)
        }, 500)
      }
    }
  }

  /**
   * Call after a TUIOTouch update.
   *
   * @method onTouchUpdate
   * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
   */
  onTouchUpdate (tuioTouch) {
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

      console.log(tuioTouch);
      this.moveTo(newX, newY, radToDeg(tuioTouch.angle))
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
  onTagCreation (tuioTag) {
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
  onTagUpdate (tuioTag) {
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
  moveTo (x, y, angle = null) {
    this._x = x
    this._y = y
    this._domElem.css('left', `${x}px`)
    this._domElem.css('top', `${y}px`)
    if (angle !== null) {
      this._domElem.css('transform', `rotate(${angle}deg)`)
    }

  }
}

export default ImageWidget
