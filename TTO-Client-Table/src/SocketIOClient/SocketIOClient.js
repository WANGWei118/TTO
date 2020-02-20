/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

import io from 'socket.io-client'

import { PING_SOCKETIO_TYPE, PONG_SOCKETIO_TYPE, MESSAGE } from './constants'

/**
 * Manage SocketIOClient singleton class.
 *
 * @type SocketIOClient
 * @private
 */
let socketIOClientInstance = null

/**
 * Main class to manage SocketIOClient.
 *
 * @class SocketIOClient
 */
class SocketIOClient {
  /**
   * SocketIOClient constructor.
   *
   * @constructor
   */
  constructor() {
    this.isValided = false

    if (socketIOClientInstance !== null) {
      return socketIOClientInstance
    }

    socketIOClientInstance = this

    this._client = null

    return socketIOClientInstance
  }

  /**
   * Init and start SocketIOClient.
   *
   * @method getInstance
   * @static
   * @returns {SocketIOClient} The SocketIOClient instance.
   */
  static getInstance() {
    return new SocketIOClient()
  }

  /**
   * Init and start SocketIOClient.
   *
   * @method start
   * @param {string} socketIOUrl - Socket IO Server's url. Default : 'http://172.20.10.2:10000/'
   */
  start(socketIOUrl = 'http://172.20.10.2:10000/') {
    this._client = io(socketIOUrl)
    this._client.on(PING_SOCKETIO_TYPE, (data) => {
      this.handlePing(data)
    })

    this._client.on(MESSAGE, (data) => {
      this.getMessage(data)
    })

    this._client.on('all quizz', (data) => {
      console.log(data)
    })
  }

  sendBntMessage() {
    this._client.emit('get quizz', {type: 'table'})
  }

  playMusic(){
    this._client.emit('play music')
  }

  pauseMusic(){
    this._client.emit('pause music')
  }
  getMessage(data) {
    console.log(`Received message ${data}!`)
  }

  /**
   * Handle PING Action from socket.
   *
   * @method handlePing
   * @param {JSON} socketData
   */
  handlePing(socketData) {
    console.log(`Received PING from ${socketData.id}!`)
    this._client.emit(PONG_SOCKETIO_TYPE, { id: 'Web' })
  }

  valideAction() {
    this.isValided = true
    console.log(this.isValided)
  }

  getValided() {
    return this.isValided
  }

  sendValidedAction(type) {
    console.log('Send valided action to server')
    this._client.emit('valided action', {type: type})
  }
}

export default SocketIOClient
