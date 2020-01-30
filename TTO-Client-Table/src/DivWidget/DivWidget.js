import TUIOWidget from 'tuiomanager/core/TUIOWidget'
import $ from 'jquery/dist/jquery.min'
let des = '';
let validedAnswers = 0;
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
    // this._domElem.appendChild()
    console.log(this._domElem)
    this._domElem[0].style.border = '10px solid #da8c3b'
    this._domElem[0].style.borderRadius = '50px'
    this._domElem.css('display', `none`)
    // console.log(this._domElem)
    this._domElem[0].id = 'answerZone'

    var para = document.createElement('h1');
    var node = document.createTextNode('hello');
    para.appendChild(node)
    this._domElem[0].appendChild(para)
    console.log(this._domElem[0])

    this.socket._client.on('start quiz collaborative', (data) => {
      console.log(data)
      des = data.description
      this._domElem[0].style.display = 'flex'
      this._domElem[0].style.flexDirection = 'column'
      this._domElem[0].innerHTML = '<p>' + data.description + '</p>' + '<p>' +
        'Pommes: ' + validedAnswers + '</p>'
      // this._domElem[0].innerText = data[0].description + '\n' + 'Pommes : ' + validedAnswers
    })

    this.socket._client.on('validation', (data) => {
      if (data.valid) {
        this._domElem[0].innerText = 'Bravo'
        validedAnswers++;
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
