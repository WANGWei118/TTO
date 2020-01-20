import TUIOWidget from 'tuiomanager/core/TUIOWidget'
import $ from 'jquery/dist/jquery.min'

class DivWidget extends TUIOWidget {
  constructor(x, y, width, height, socket) {
    super(x, y, width, height)
    this.socket = socket
    this._domElem = $('<div>Mettez les pommes au milieu</div>')
    this._domElem.css('width', `${width}px`)
    this._domElem.css('height', `${height}px`)
    this._domElem.css('position', 'absolute')
    this._domElem.css('left', `${x}px`)
    this._domElem.css('top', `${y}px`)
    console.log(this._domElem)
    this._domElem[0].style.border = '10px solid #da8c3b'
    this._domElem[0].style.borderRadius = '50px'
    // console.log(this._domElem)

    this.socket._client.on('validation', (data) => {
      if (data.valid) {
        this._domElem[0].innerHTML = '<h1>Bravo</h1>'
      }
    })
  }

  get domElem() { return this._domElem }
}

export default DivWidget
