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
let quiz = []

/* App Code */
const buildApp = () => {
  // const imageWidget = new ImageElementWidget(0, 0, 365, 289, 0, 1, 'assets/UCAlogoQhaut.png')
  // imageWidget.addTo('#app')
  const bntWidget = new ButtonWidget(30, 500, 100, 100, 'Lancer le quiz', socketIOClient)
  // const imageApple = new ImageWidget(280, 100, 1314, 672, 'assets/rectangle.png')
  const divWidget = new DivWidget(500, 200, 1000, 500, socketIOClient, quiz)
  // const imageWidget1 = new ImageWidget(0, 0, 200, 200, 'assets/apple.jpg', socketIOClient)
  socketIOClient._client.on('all tableQuiz', (data) => {
    quizLancez = true
    quiz = data
    console.log(data)
    for (let i = 0; i < data[0].pictures.length; i++) {
      const imageWidget1 = new ImageWidget(0, i * 300, 200, 200, data[0].pictures[i].src, socketIOClient, data[0].pictures[i].isAnswer)
      $('#app').append(imageWidget1.domElem)
    }

    // console.log(imageWidgets.length)
    // $(window)
    //   .ready(() => {
    //     buildApp()
    //   })
  })

  bntWidget.onClick()

  console.log(imageWidgets)
  $('#app')
    .append(bntWidget.domElem)
    .append(divWidget.domElem)
    .append(imageWidget1.domElem)
  // for (let i = 0; i < imageWidgets.length; i++) {
  //   if (i === 0) {
  //     $('#app')
  //       .append(bntWidget.domElem)
  //       .append(divWidget.domElem)
  //       .append(imageWidgets[i])
  //   }else{
  //     $('#app')
  //       // .append(imageApple.domElem)
  //       .append(imageWidgets[i])
  //
  //   }
  // }
}
//
// if (quizLancez) {
//   $(window)
//     .ready(() => {
//       buildApp()
//     })
// }
$(window)
  .ready(() => {
    buildApp()
  })

