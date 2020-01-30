/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

import $ from 'jquery/dist/jquery.min'
import TUIOManager from 'tuiomanager/core/TUIOManager'
// import ImageElementWidget from 'tuiomanager/widgets/ElementWidget/ImageElementWidget/ImageElementWidget'
import ImageWidget from './ImageWidget/ImageWidget'

import SocketIOClient from './SocketIOClient/SocketIOClient'
import ButtonWidget from './ButtonWidget/ButtonWidget'
import DivWidget from './DivWidget/DivWidget'

/* TUIOManager start */
const tuioManager = new TUIOManager()
tuioManager.start()

/* Start SocketIO Client */
const socketIOClient = new SocketIOClient()
socketIOClient.start()
socketIOClient.getMessage()

let quizLancez = false
const imageWidgets = []
let quiz = null
const positions = []

/* App Code */
const buildApp = () => {
  const testBnt = new ButtonWidget(0, 500, 100, 100, 'Tangible', socketIOClient)
  const divWidget = new DivWidget(500, 200, 1000, 500, socketIOClient, quiz)

  socketIOClient._client.on('start quiz collaborative', (data) => {
    quizLancez = true
    quiz = data
    console.log(data)
    for (let i = 0; i < data.pictures.length; i++) {
      const imageWidget1 = new ImageWidget(0, i * 300, 200, 200, data.pictures[i].src, socketIOClient, data.pictures[i].isAnswer)
      $('#app').append(imageWidget1.domElem)
    }
  })

  console.log('sdf')
  console.log(testBnt.domElem[0])
  testBnt.domElem[0].addEventListener('click', () => {
    console.log('hello world')
    // $('#app').empty()
    socketIOClient._client.emit('get quiz tangible')
  })

  socketIOClient._client.on('quiz tangible', (data) => {
    console.log(data)
    $('#app').empty()
      .append(imageDiv(data.pictures.length, data.pictures, data.description))

  })

  socketIOClient._client.on('next question', (data) => {
    $('#app').empty()
    if (data.type === 'tangible') {
      console.log('Tangible')
    } else {
      console.log('Non tangible')
    }
  })

  console.log(imageWidgets)
  $('#app')
    .append(divWidget.domElem)
    .append(testBnt.domElem)

}
$(window)
  .ready(() => {
    buildApp()
  })

function addWidget (data) {
  console.log(data)
  if (data.type === 'tangible') {
    console.log('Tangible')
  } else {
    console.log('Non tangible')
    for (let i = 0; i < data.pictures.length; i++) {
      // for (let j = 0; j < 3; j++) {
      const imageWidget1 = new ImageWidget(0, i * 300, 200, 200, data.pictures[i].src, socketIOClient, data.pictures[i].isAnswer)
      $('#app').append(imageWidget1.domElem)
      // }
    }
  }
}

/**
 * 左右间隔50px
 * left 1500
 * top: 650
 */

function getPosition () {
  for (let i = 0; i < 5; i += 300) {
    for (let j = 0; j < 3; j += 300) {
      const position = {x: i, y: j}
    }
  }

}

function imageDiv (picNum, pics, title) {
  var imageDiv = document.createElement('div')
  var titleTop = document.createElement('h1')
  var titleBottom = document.createElement('h1')
  var titleLeft = document.createElement('h1')
  var titleRight = document.createElement('h1')
  titleTop.setAttribute('class', 'titleT')
  titleBottom.setAttribute('class', 'titleB')
  titleLeft.setAttribute('class', 'titleL')
  titleRight.setAttribute('class', 'titleR')
  imageDiv.setAttribute('class', 'imageDiv')
  titleTop.innerText = title
  titleBottom.innerText = title
  titleLeft.innerText = title
  titleRight.innerText = title
  for (let i = 0; i < picNum; i++) {
    var image = document.createElement('img')
    image.setAttribute('class', 'image')
    image.src = pics[i].src
    image.style.transform = 'rotate(' + random(0, 180) + 'deg)'
    image.style.width = '200px'
    image.style.height = '200px'
    imageDiv.append(image)
  }
  imageDiv.append(titleTop, titleBottom, titleLeft, titleRight)
  return imageDiv
}

function random (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}



