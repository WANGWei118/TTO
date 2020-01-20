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

/* App Code */
const buildApp = () => {
  // const imageWidget = new ImageElementWidget(0, 0, 365, 289, 0, 1, 'assets/UCAlogoQhaut.png')
  // imageWidget.addTo('#app')
  const bntWidget = new ButtonWidget(30, 500, 100, 100, 'Hello world', socketIOClient)
  // const imageApple = new ImageWidget(280, 100, 1314, 672, 'assets/rectangle.png')
  const divWidget = new DivWidget(500, 200, 1000, 500, socketIOClient)


  const imageWidget = new ImageWidget(0, 0, 200, 200, 'assets/apple-fruit.jpg', socketIOClient)

  bntWidget.onClick()
  // console.log(bntMessage)

  $('#app')
    .append(imageWidget.domElem)
    // .append(imageApple.domElem)
    .append(bntWidget.domElem)
    .append(divWidget.domElem)
  console.log(bntWidget)
}

$(window)
  .ready(() => {
    buildApp()
  })
