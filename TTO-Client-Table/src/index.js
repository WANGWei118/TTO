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
import { QUIZ_FINISHED } from './SocketIOClient/constants'

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
let rightAnswer = 0
let rightAnswersNum = 0

/* App Code */
const buildApp = () => {
  wait()

  socketIOClient._client.on('start quiz collaborative', (data) => {
    quizLancez = true
    quiz = data
    rightAnswer = 0
    rightAnswersNum = data.rightAnswers
    console.log(data)
    $('#app').empty()
      .append(nonTangibleDiv(data.pictures.length, data.pictures, data.description))
  })

  socketIOClient._client.on('quiz tangible', (data) => {
    rightAnswer = 0
    rightAnswersNum = data.rightAnswers
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

  socketIOClient._client.on('validation', (data) => {
    if (data.valid === true) {
      rightAnswer++
      if (rightAnswersNum === rightAnswer) {
        setTimeout(() => {
          finished()
          socketIOClient._client.emit(QUIZ_FINISHED, {type: 'no tangible'})
        }, 1000)
      }
    }
  })

}
$(window)
  .ready(() => {
    buildApp()
  })

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
    const image = document.createElement('img')
    image.setAttribute('class', 'image')
    image.src = pics[i].src
    image.style.transform = 'rotate(' + random(0, 180) + 'deg)'
    image.style.width = '200px'
    image.style.height = '200px'
    image.addEventListener('click', () => {
      console.log(pics[i])
      if (pics[i].isAnswer === true) {
        rightAnswer++
        if (rightAnswer === rightAnswersNum) {
          socketIOClient._client.emit(QUIZ_FINISHED, {type: 'tangible'})
          finished()
        }
        image.style.display = 'none'
        var bravo = document.createElement('h1')
        bravo.setAttribute('class', 'information')
        bravo.innerText = 'Bravo'
        imageDiv.append(bravo)
        setTimeout(() => {
          imageDiv.removeChild(bravo)
        }, 2000)
      } else {
        console.log('Essayez encore!')
        image.style.display = 'none'
        var again = document.createElement('h1')
        again.setAttribute('class', 'information')
        again.innerText = 'Essayez encore'
        imageDiv.append(again)
        setTimeout(() => {
          imageDiv.removeChild(again)
        }, 2000)
      }
    })
    imageDiv.append(image)
  }
  imageDiv.append(titleTop, titleBottom, titleLeft, titleRight)
  return imageDiv
}

function nonTangibleDiv (picNum, pic, title) {
  var nonTangibleDiv = document.createElement('div')
  var answerBox = document.createElement('div')
  var titleTop = document.createElement('h1')
  var titleBottom = document.createElement('h1')
  var titleLeft = document.createElement('h1')
  var titleRight = document.createElement('h1')
  titleTop.setAttribute('class', 'titleT')
  titleBottom.setAttribute('class', 'titleB')
  titleLeft.setAttribute('class', 'titleL')
  titleRight.setAttribute('class', 'titleR')
  nonTangibleDiv.setAttribute('class', 'nonTangibleDiv')
  answerBox.setAttribute('class', 'answerBox')
  titleTop.innerText = title
  titleBottom.innerText = title
  titleLeft.innerText = title
  titleRight.innerText = title
  console.log(pic)
  for (let i = 0; i < picNum; i++) {
    const imageWidget1 = new ImageWidget(0, i * 300, 200, 200, pic[i].src, socketIOClient, pic[i].isAnswer, rightAnswersNum)
    imageWidget1.domElem[0].style.transform = 'rotate(' + random(0, 180) + 'deg)'
    $('#app').append(imageWidget1.domElem)
  }
  nonTangibleDiv.append(titleTop, titleBottom, titleLeft, titleRight, answerBox)
  return nonTangibleDiv
}

function random (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

function wait () {
  var waitDiv = document.createElement('div')
  var waitImage = document.createElement('img')
  var waitTitle = document.createElement('h1')
  waitImage.setAttribute('id', 'waitImage')
  waitDiv.setAttribute('id', 'waitDiv')
  waitTitle.setAttribute('id', 'waitTitle')
  waitTitle.innerText = 'Notre moment arrive...'
  waitImage.src = 'assets/quiz.png'
  waitDiv.append(waitImage, waitTitle)
  $('#app').append(waitDiv)
}

function finished () {
  var finishDiv = document.createElement('div')
  var finishImage = document.createElement('img')
  var finishTitle = document.createElement('h1')
  finishImage.setAttribute('id', 'finishImage')
  finishDiv.setAttribute('id', 'finishDiv')
  finishTitle.setAttribute('id', 'finishTitle')
  finishTitle.innerText = 'Bravo!'
  finishImage.src = 'assets/rate.png'
  finishDiv.append(finishImage, finishTitle)
  $('#app').empty()
    .append(finishDiv)
}



