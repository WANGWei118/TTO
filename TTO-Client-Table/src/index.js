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
import { NEXT_QUESTION, QUIZ_FINISHED } from './SocketIOClient/constants'
import ImageTouchWidget from './ImageWidget/ImageTouchWidget'

const windowsWidth = $(window).width()
const windowsHeight = $(window).height()

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
  // wait()
  contretration()

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
    if (data.type === 'tangible') {
      rightAnswer = 0
      rightAnswersNum = data.rightAnswers
      console.log('Tangible')
      $('#app').empty()
        .append(imageDiv(data.pictures.length, data.pictures, data.description))
    } else {
      rightAnswer = 0
      rightAnswersNum = data.rightAnswers
      console.log('Non tangible')
      $('#app').empty()
        .append(nonTangibleDiv(data.pictures.length, data.pictures, data.description))
    }
  })

  socketIOClient._client.on('validation', (data) => {
    if (data.valid === true) {
      rightAnswer++
      if (rightAnswersNum === rightAnswer) {
        setTimeout(() => {
          finished()
          // socketIOClient._client.emit(QUIZ_FINISHED, {type: 'no tangible'})
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
  var acount = 1
  for (let i = 0; i < picNum; i++) {
    //   if (acount <= 3) {
    //     const imageWidget1 = new ImageTouchWidget(acount * 300, 150, 150, 150, pics[i].src, socketIOClient, pics[i].isAnswer, rightAnswersNum)
    //     imageWidget1.domElem[0].style.transform = 'rotate(' + random(0, 180) + 'deg)'
    //     acount++
    //     $('#app').append(imageWidget1.domElem)
    //   } else {
    //     const imageWidget2 = new ImageTouchWidget((acount - 3) * 300, 450, 150, 150, pics[i].src, socketIOClient, pics[i].isAnswer, rightAnswersNum)
    //     imageWidget2.domElem[0].style.transform = 'rotate(' + random(0, 180) + 'deg)'
    //     acount++
    //     $('#app').append(imageWidget2.domElem)
    //   }
    const image = document.createElement('img')
    image.src = pics[i].src
    image.style.transform = 'rotate(' + random(0, 180) + 'deg)'
    image.setAttribute('class', 'images')
    image.addEventListener('click', () => {
      console.log(pics[i])
      if (pics[i].isAnswer === true) {
        rightAnswer++
        if (rightAnswer === rightAnswersNum) {
          // socketIOClient._client.emit(QUIZ_FINISHED, {type: 'tangible'})
          finished()
          rightAnswersNum = 0
          rightAnswer = 0
          // socketIOClient._client.emit(NEXT_QUESTION, {type: 'tangible'})
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
    const imageWidget1 = new ImageWidget(0, i * 300, 150, 150, pic[i].src, socketIOClient, pic[i].isAnswer, rightAnswersNum)
    imageWidget1.domElem[0].style.transform = 'rotate(' + random(0, 180) + 'deg)'
    $('#app').append(imageWidget1.domElem)
  }
  console.log($(window).width(), $(window).height())
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

// from {
//   height: 0;
//   top: 400px;
// }
// to {
//   height: 400px;
//   top: 0;
// }
function contretration () {
  var container = document.createElement('div')
  container.setAttribute('class', 'container')
  // while (true) {
  var timer = random(500, 2000)
  // setTimeout(() => {
  var leftPostion = random(100, windowsWidth - 100)
  var note = random(1, 8)
  var rand = document.createElement('p')
  rand.setAttribute('class', 'rand')
  var flower = document.createElement('img')
  flower.setAttribute('class', 'flower')
  flower.src = 'assets/' + note + '.svg'
  rand.append(flower)
  // rand.animate(keyframe.from, keyframe.to)
  rand.style.left = leftPostion + 'px'
  container.append(rand)
  $('#app').empty()
    .append(container)
  // }, timer)
  // }

  // for (let i = 0; i < 24; i++) {
  //   // var zone = document.createElement('p')
  //   // zone.setAttribute('class', 'zone')
  //   var rand = document.createElement('p')
  //   rand.setAttribute('class', 'rand')
  //   var flower = document.createElement('img')
  //   flower.setAttribute('class', 'flower')
  //   flower.src = 'assets/flower3.jpg'
  //   rand.append(flower)
  //   container.append(rand)
  //   // container.append(zone)
  // }
}



