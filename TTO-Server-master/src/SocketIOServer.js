/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

import http from 'http'
import express from 'express'
import sio from 'socket.io'

const database = require('./database/database')

/**
 * Main class to manage SocketIOServer.
 *
 * @class SocketIOServer
 */
class SocketIOServer {
  /**
   * SocketIOServer constructor.
   *
   * @constructor
   */
  constructor () {
    this._socketIOClients = {}
    this._onNewClientCallback = null
    this._onClientDisconnectionCallback = null
    database.init()
  }

  /**
   * Init and start SocketIOServer.
   *
   * @method start
   * @param {number} socketIOPort - Socket IO Server's port. Default : 10000
   */
  start (socketIOPort = 10000) {
    this._app = express()
    this._httpServer = http.createServer(this._app)
    this._ioServer = sio(this._httpServer)
    this.handleSocketIOClient()

    this._httpServer.listen(socketIOPort, () => {
      console.info('SocketIOServer is ready.')
      console.info('Socket.IO\'s port is ', socketIOPort)
    })
  }

  closeDatabase () {
    database.closeDatabases()
  }

  /**
   * Set the new client callback.
   *
   * @method onNewClient
   * @param {Function} newClientCallback - new client callback function.
   */
  onNewClient (newClientCallback) {
    this._onNewClientCallback = newClientCallback
  }

  /**
   * Set the client disconnection callback.
   *
   * @method onClientDisconnection
   * @param {Function} clientDisconnectionCallback - client disconnection callback function.
   */
  onClientDisconnection (clientDisconnectionCallback) {
    this._onClientDisconnectionCallback = clientDisconnectionCallback
  }

  onClientMessage (clientMessageCallBack) {
    this._onClientMessageCallback = clientMessageCallBack
  }

  /**
   * New client.
   *
   * @method newClient
   * @param {Object} socket - client socket.
   */
  newClient (socket) {
    this._socketIOClients[socket.id] = true
    if (this._onNewClientCallback !== null) {
      this._onNewClientCallback(socket)
    }
  }

  /**
   * Disconnect client.
   *
   * @method disconnectClient
   * @param {Object} socket - client socket.
   */
  disconnectClient (socket) {
    if (this._onClientDisconnectionCallback !== null) {
      this._onClientDisconnectionCallback(socket)
    }
    delete this._socketIOClients[socket.id]
  }

  /**
   * Handle new Socket.IO 's client connection.
   *
   * @method handleSocketIOClient
   */
  handleSocketIOClient () {
    this._ioServer.on('connection', (socket) => {
      console.info('New Socket.IO Client Connection : ', socket.id)
      this.newClient(socket)

      socket.on('MESSAGE', () => {
        console.log('hello')
        socket.emit('test', 'hellollllll')
      })

      socket.on('get quizz', (data) => {
        if (data.type === 'table') {
          console.log('Client wants quizz of table')
          database.sendTableQuiz(socket)
        } else {
          console.log('Client wants quizz')
          database.sendPadQuizz(socket)
        }
      })

      socket.on('valided action', (data) => {
        console.log('Received valided action from client')
        if (data.type === true) {
          socket.emit('validation', {valid: true})
        } else {
          socket.emit('validation', {valid: false})
        }
      })

      socket.on('get all types quiz', () => {
        console.log('get all types quiz')
        database.sendAllQuizz(socket)
      })

      socket.on('get images', () => {
        console.log('Client want images')
        database.sendImages(socket)
      })

      socket.on('add quiz collaborative', (data) => {
        console.log('add quiz collaborative')
        console.log(data)
        database.addQuizCollaborative(data, socket)
      })

      socket.on('nextQuestion', (data) => {
        console.log('next question collaborative')
        socket.emit('next question', data)
      })

      socket.on('lancer quiz collaborative', (data) => {
        console.log('lancer quiz collaborative')
        console.log(data)
        socket.broadcast.emit('start quiz collaborative', data)
      })

      socket.on('lancer quiz tangible', (data) => {
        console.log('lancer quiz tangible')
        console.log(data)
        socket.broadcast.emit('quiz tangible', data)
      })

      socket.on('add quiz', (data) => {
        console.log(data)
        database.addQuiz(data, socket)
      })

      /**
       * Send quiz
       */
      socket.on('get quiz tangible', () => {
        console.log('get quiz tangible')
        database.sendQuizTangible(socket)
      })

      socket.on('get quiz non tangible', () => {
        console.log('get quiz non tangible')
        database.sendQuizNonTangible(socket)
      })

      socket.on('disconnect', () => {
        console.info('Socket.IO Client disconnected : ', socket.id)
        this.disconnectClient(socket)
      })

      socket.on('error', (errorData) => {
        console.info('An error occurred during Socket.IO Client connection : ', socket.id)
        console.debug(errorData)
        this.disconnectClient(socket)
      })

      socket.on('reconnect', (attemptNumber) => {
        console.info('Socket.io Client Connection : ', socket.id, ' after ', attemptNumber, ' attempts.')
        this.newClient(socket)
      })

      socket.on('reconnect_attempt', () => {
        console.info('Socket.io Client reconnect attempt : ', socket.id)
      })

      socket.on('reconnecting', (attemptNumber) => {
        console.info('Socket.io Client Reconnection : ', socket.id, ' - Attempt number ', attemptNumber)
        this.disconnectClient(socket)
      })

      socket.on('reconnect_error', (errorData) => {
        console.info('An error occurred during Socket.io Client reconnection for Root namespace : ', socket.id)
        console.debug(errorData)
        this.disconnectClient(socket)
      })

      socket.on('reconnect_failed', () => {
        console.info('Failed to reconnect Socket.io Client for Root namespace : ', socket.id, '. No new attempt will be done.')
        this.disconnectClient(socket)
      })
    })
  }
}

/**
 * add quiz
 * @param data
 */

function addQuiz (data) {

}

export default SocketIOServer
