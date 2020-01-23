import TUIOWidget from 'tuiomanager/core/TUIOWidget'
import $ from 'jquery/dist/jquery.min'
let des = '';
class DivWidget extends TUIOWidget {

  constructor (x, y, width, height, socket, quiz) {
    super(x, y, width, height)
    this.socket = socket
    this.quiz = quiz
    this._domElem = $('<div></div>')
    this._domElem.css('width', `${width}px`)
    this._domElem.css('height', `${height}px`)
    this._domElem.css('position', 'absolute')
    this._domElem.css('left', `${x}px`)
    this._domElem.css('top', `${y}px`)
    this._domElem.css('fontSize', `50px`)
    this._domElem.css('color', `#730707a3`)
    console.log(this._domElem)
    this._domElem[0].style.border = '10px solid #da8c3b'
    this._domElem[0].style.borderRadius = '50px'
    this._domElem.css('display', `none`)
    // console.log(this._domElem)
    this._domElem[0].id = 'answerZone'

    this.socket._client.on('all tableQuiz', (data) => {
      console.log(data)
      des = data[0].description
      this._domElem[0].style.display = 'flex'
      this._domElem[0].innerText = data[0].description
    })

    this.socket._client.on('validation', (data) => {
      if (data.valid) {
        this._domElem[0].innerText = 'Bravo'
      } else {
        this._domElem[0].innerText = 'Essayez encore!'
        setTimeout(() => {
          this._domElem[0].innerText = des
        }, 3000)
      }
    })
  }

  get domElem () { return this._domElem }
}

export default DivWidget
