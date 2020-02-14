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
var played = false
const url = 'http://192.168.43.223:10000/'
var timer = null
let timeout = setTimeout(() => {

}, 1000)

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
let musicTimer = null
const positions = [
  {x: 150, y: 150},
  {x: 150, y: 350},
  {x: 150, y: 500},
  {x: 150, y: 650},
  {x: 150, y: 800},
  {x: 350, y: 150},
  {x: 500, y: 150},
  {x: 650, y: 150},
  {x: 800, y: 150},
  {x: 950, y: 150},
  {x: 1650, y: 150},
  {x: 1650, y: 350},
  {x: 1650, y: 500},
  {x: 1650, y: 650},
  {x: 150, y: 900},
  {x: 350, y: 900},
  {x: 500, y: 900},
  {x: 650, y: 900},
  {x: 800, y: 900},
  {x: 950, y: 900},
]
let rightAnswer = 0
let rightAnswersNum = 0
let isElse = false
let randedPosition = []
let audio = null

/* App Code */
const buildApp = () => {
  wait()
  socketIOClient._client.on('fun quiz start', (data) => {
    console.log(data)
    audio = null
    audio = new Audio(url + data.src)
    // audio.play()
    isElse = false
    $('#app').empty()
    forConentration(data.src)
    quizLancez = true
  })

  socketIOClient._client.on('play', (data) => {
    console.log(data)
    clearTimeout(timeout)
    if (data === true) {
      audio.play()
      timeout = setTimeout(() => {
        audio.pause()
      }, 4000)
    } else {
      setTimeout(() => {
        audio.pause()
      }, 3000)
    }
  })

  musicTimer = setInterval(() => {
    // socketIOClient._client.emit('pause music')
  }, 7000)

  socketIOClient._client.on('start quiz collaborative', (data) => {
    console.log(data)
    audio = null
    quizLancez = true
    clearInterval(timer)
    clearInterval(musicTimer)
    quiz = data
    rightAnswer = 0
    rightAnswersNum = data.rightAnswers
    isElse = true
    $('#app').empty()
      .append(nonTangibleDiv(data.pictures.length, data.pictures, data.description))
  })

  socketIOClient._client.on('quiz tangible', (data) => {
    rightAnswer = 0
    console.log(data)
    audio = null
    clearInterval(timer)
    clearInterval(musicTimer)
    rightAnswersNum = data.rightAnswers
    isElse = true
    console.log(data)
    $('#app').empty()
      .append(imageDiv(data.pictures.length, data.pictures, data.description))
  })

  socketIOClient._client.on('next question', (data) => {
    console.log(data)
    if (data.type === 'handsTouch') {
      rightAnswer = 0
      rightAnswersNum = data.rightAnswers
      console.log('Tangible')
      isElse = true
      $('#app').empty()
        .append(imageDiv(data.pictures.length, data.pictures, data.description))
    } else {
      rightAnswer = 0
      rightAnswersNum = data.rightAnswers
      console.log('Non tangible')
      isElse = true
      $('#app').empty()
        .append(nonTangibleDiv(data.pictures.length, data.pictures, data.description))
    }
  })

  socketIOClient._client.on('validation', (data) => {
    if (data.valid === true) {
      rightAnswer++
      console.log(rightAnswer, rightAnswersNum)
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
  randedPosition = getRandomPosition(picNum)
  for (let i = 0; i < picNum; i++) {
    const imageWidget1 = new ImageTouchWidget(positions[randedPosition[i]].x, positions[randedPosition[i]].y, 140, 140, pics[i].src, socketIOClient, pics[i].isAnswer, rightAnswersNum, i)
    imageWidget1.domElem[0].style.transform = 'rotate(' + random(0, 180) + 'deg)'
    $('#app').append(imageWidget1.domElem)
    //   const image = document.createElement('img')
    //   image.src = pics[i].src
    //   image.style.transform = 'rotate(' + random(0, 180) + 'deg)'
    //   image.setAttribute('class', 'images')
    //   image.addEventListener('click', () => {
    //     console.log(pics[i])
    //     if (pics[i].isAnswer === true) {
    //       rightAnswer++
    //       if (rightAnswer === rightAnswersNum) {
    //         // socketIOClient._client.emit(QUIZ_FINISHED, {type: 'tangible'})
    //         finished()
    //         rightAnswersNum = 0
    //         rightAnswer = 0
    //         // socketIOClient._client.emit(NEXT_QUESTION, {type: 'tangible'})
    //       }
    //       image.style.display = 'none'
    //       var bravo = document.createElement('h1')
    //       bravo.setAttribute('class', 'information')
    //       bravo.innerText = 'Bravo'
    //       imageDiv.append(bravo)
    //       setTimeout(() => {
    //         imageDiv.removeChild(bravo)
    //       }, 2000)
    //     } else {
    //       console.log('Essayez encore!')
    //       image.style.display = 'none'
    //       var again = document.createElement('h1')
    //       again.setAttribute('class', 'information')
    //       again.innerText = 'Essayez encore'
    //       imageDiv.append(again)
    //       setTimeout(() => {
    //         imageDiv.removeChild(again)
    //       }, 2000)
    //     }
    //   })
    //   imageDiv.append(image)
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
  randedPosition = getRandomPosition(picNum)
  console.log(pic)
  for (let i = 0; i < picNum; i++) {
    const imageWidget1 = new ImageWidget(positions[randedPosition[i]].x, positions[randedPosition[i]].y, 140, 140, pic[i].src, socketIOClient, pic[i].isAnswer, rightAnswersNum, i)
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
  waitTitle.innerText = 'Jouons ensemble, les amis!'
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
/*
function contretration () {
  var titleTop = document.createElement('h1')
  var titleBottom = document.createElement('h1')
  var titleLeft = document.createElement('h1')
  var titleRight = document.createElement('h1')
  titleTop.setAttribute('class', 'titleT')
  titleBottom.setAttribute('class', 'titleB')
  titleLeft.setAttribute('class', 'titleL')
  titleRight.setAttribute('class', 'titleR')
  titleTop.innerText = 'Jouez avec les notes'
  titleBottom.innerText = 'Jouez avec les notes'
  titleLeft.innerText = 'Jouez avec les notes'
  titleRight.innerText = 'Jouez avec les notes'
  var audio = new Audio('assets/lemon.mp3')
  $('#app').append(titleTop, titleBottom, titleLeft, titleRight)
  setInterval(() => {
    var top = random(400, windowsHeight - 400)
    var left = random(400, windowsWidth - 400)
    const imageWidget = new DivWidget(left, top, 200, 200, socketIOClient)
    imageWidget.domElem[0].setAttribute('class', 'noteClass')
    var image = document.createElement('img')
    image.setAttribute('class', 'note')
    image.style.transform = 'rotate(' + random(0, 180) + 'deg)'
    var pictureId = random(1, 8)
    image.src = 'assets/' + pictureId + '.svg'
    image.addEventListener('click', () => {
      console.log('hello')
      played = true
      setTimeout(() => {
        imageWidget.domElem[0].setAttribute('class', 'vanishedNote')
        setTimeout(() => {
          imageWidget.domElem[0].style.display = 'none'
        }, 1000)
      }, 500)
    })
    if (played) {
      audio.play()
    } else {
      audio.pause()
    }
    imageWidget.domElem[0].append(image)
    $('#app').append(imageWidget.domElem)
    setTimeout(() => {
      imageWidget.domElem[0].setAttribute('class', 'vanishedNote')
      setTimeout(() => {
        imageWidget.domElem[0].style.display = 'none'
      }, 3000)
    }, 3000)
    played = false
  }, 3000)
}
 */

function forConentration (audioSrc) {
  if (!isElse) {
    var titleTop = document.createElement('div')
    var titleBottom = document.createElement('div')
    var titleLeft = document.createElement('div')
    var titleRight = document.createElement('div')
    titleTop.setAttribute('class', 'titleT')
    titleBottom.setAttribute('class', 'titleB')
    titleLeft.setAttribute('class', 'titleL')
    titleRight.setAttribute('class', 'titleR')
    titleTop.innerHTML = '<h1>Jouez avec les notes</h1>'
    titleBottom.innerText = 'Jouez avec les notes'
    titleLeft.innerText = 'Jouez avec les notes'
    titleRight.innerText = 'Jouez avec les notes'
    var audio = new Audio('assets/lemon.mp3')
    $('#app').append(titleTop, titleBottom, titleLeft, titleRight)
    timer = setInterval(() => {
      var top = random(400, windowsHeight - 400)
      var left = random(400, windowsWidth - 400)
      const imageWidget = new DivWidget(left, top, 200, 200, socketIOClient, false, audioSrc)
      imageWidget.domElem[0].setAttribute('class', 'noteClass')
      var image = document.createElement('img')
      image.setAttribute('class', 'note')
      image.style.transform = 'rotate(' + random(0, 180) + 'deg)'
      var pictureId = random(1, 8)
      image.src = 'assets/' + pictureId + '.svg'
      imageWidget.domElem[0].append(image)
      $('#app').append(imageWidget.domElem)
      setTimeout(() => {
        imageWidget.domElem[0].setAttribute('class', 'vanishedNote')
        setTimeout(() => {
          imageWidget.domElem[0].style.display = 'none'
        }, 3000)
      }, 3000)
      imageWidget.played = false
    }, 3000)
  }

}

function getRandomPosition (num) {
  var arr1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
  var out = []
  let i = 0
  while (i < num) {
    var index = parseInt(Math.random() * arr1.length)
    out = out.concat(arr1.splice(index, 1))
    // out = out.concat(positions.splice(index, 1))
    i++
  }
  console.log(out)
  return out
}

$('#app').mousemove(function (e) {
  var xx = e.originalEvent.x || e.originalEvent.X || 0
  var yy = e.originalEvent.y || e.originalEvent.Y || 0
  console.log(xx, yy)
})



