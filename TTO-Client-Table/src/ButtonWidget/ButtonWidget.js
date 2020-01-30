import $ from 'jquery/dist/jquery.min'

import TUIOWidget from 'tuiomanager/core/TUIOWidget'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from 'tuiomanager/core/constants'
import { radToDeg } from 'tuiomanager/core/helpers'

class ButtonWidget extends TUIOWidget {
  constructor (x, y, width, height, text, socket) {
    super(x, y, width, height)
    this._domElem = $('<button></button>')
    this._domElem[0].innerText = text
    this.socket = socket
    this._domElem.css('width', `${width}px`)
    this._domElem.css('height', `${height}px`)
    this._domElem.css('position', 'absolute')
    this._domElem.css('left', `${x}px`)
    this._domElem.css('top', `${y}px`)

    // socket._client.on('all tableQuiz', (data) => {
    //   console.log(data)
    //   this._domElem.css('display', `none`)
    // })
  }

  onClick () {
    this._domElem[0].addEventListener('click', () => {
      console.log(this._domElem[0].innerText)
      this.socket.sendBntMessage()
      this._domElem.css('display', `none`)
    })
  }

  get domElem () { return this._domElem }
}

export default ButtonWidget
