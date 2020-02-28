/**
 * @author Kevin Duglue <kevin.duglue@gmail.com>
 * @author Rémy Kaloustian <remy.kaloustian@gmail.com>
 */

// Import JQuery
import $ from 'jquery/dist/jquery.min'
import ElementWidget from 'tuiomanager/widgets/ElementWidget/ElementWidget'
import TUIOManager from 'tuiomanager/core/TUIOManager'
// import ElementWidget from '../ElementWidget'
// import TUIOManager from '../../../core/TUIOManager'

/**
 * Main class to manage ImageElementWidget.
 *
 * @class ImageElementWidget
 * @extends ElementWidget
 */
class ImageElementWidget extends ElementWidget {
  /**
   * ImageElementWidget constructor.
   *
   * @constructor
   * @param {number} x - ImageElementWidget's upperleft coin abscissa.
   * @param {number} y - ImageElementWidget's upperleft coin ordinate.
   * @param {number} width - ImageElementWidget's width.
   * @param {number} height - ImageElementWidget's height.
   * @param {number} initialRotation - Initial rotation. Set to 0 of no rotation
   * @param {number} initialScale - Initial scale. Set to 1 of no rescale
   * @param {string} src - Source of the image
   */
  constructor (x, y, width, height, initialRotation, initialScale, src, socket, isRight, rightNum,
               i) {
    super(x, y, width, height, initialRotation, initialScale)
    this.src = src
    this.socket = socket
    this.isRight = isRight
    this.rightNums = rightNum
    this._domElem = $('<img>')
    this._domElem.attr('src', src)
    this._domElem.css('width', `${this.width}px`)
    this._domElem.css('height', `${this.height}px`)
    this._domElem.css('position', 'absolute')
    this._domElem.css('z-index', `${this.zIndex}`)
    this._domElem.css('left', `${x}px`)
    this._domElem.css('top', `${y}px`)
    this._domElem.css('transform', `rotate(${initialRotation}deg)`)
    this._domElem.css('transform-origin', `scale(${initialScale})`)
    this.hasDuplicate = false
    this._domElem[0].className = 'name' + i.toString()
    this.vanished = false

  } // constructor

  /**
   * Call after a TUIOTag update.
   *
   * @method onTagUpdate
   * @param {TUIOTag} tuioTag - A TUIOTag instance.
   */
  onTagUpdate (tuioTag) {
    super.onTagUpdate(tuioTag)
    if (typeof (this._lastTagsValues[tuioTag.id]) !== 'undefined') {
      if (tuioTag.id === this.tagDuplicate && !this.hasDuplicate) {
        const clone = new ImageElementWidget(this.x + 10, this.y + 10, this.width, this.height, this._currentAngle, 1, this.src, this.tagMove, this.tagDelete, this.tagZoom, this.tagDuplicate)
        TUIOManager.getInstance().addWidget(clone)
        this._domElem.parent().append(clone.domElem)
        this.hasDuplicate = true
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
          $('.nonTangibleDiv').remove($('.information0'), $('.information1'), $('.information2'), $('.information3'))
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
          $('.nonTangibleDiv').remove($('.information0'), $('.information1'), $('.information2'), $('.information3'))
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
   * Call after a TUIOTag deletion.
   *
   * @method onTagDeletion
   * @param {number/string} tuioTagId - TUIOTag's id to delete.
   */
  onTagDeletion (tuioTagId) {
    super.onTagDeletion(tuioTagId)
    if (typeof (this._lastTagsValues[tuioTagId]) !== 'undefined') {
      if (tuioTagId === this.tagDuplicate) {
        this.hasDuplicate = false
      }
    }
  }
} // class ImageElementWidget

export default ImageElementWidget
