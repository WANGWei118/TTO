/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

import http from 'http'
import express from 'express'
import sio from 'socket.io'

var bodyParser = require('body-parser')
import {
  ALL_TYPES_QUIZZ,
  INDIVIDUEL_QUIZZ,
  NEXT_QUESTION,
  NO_TANGIBLE_QUIZZ, PASS_TO_NEXT,
  QUIZ_FINISHED,
  TANGIBLE_QUIZZ
} from './constants'
import imageUpload from '../controller/img-uploader'
import profileUpload from '../controller/profile-uploader'
import topicUpload from '../controller/topic-uploader'

const MongoClient = require('mongodb').MongoClient
const urlDB = 'mongodb://localhost:27017/tto'

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
    this._app.use(bodyParser.urlencoded({extended: false}))
    this._app.use(express.static('public'))

    this._app.use(imageUpload)
    this._app.use(profileUpload)
    this._app.use(topicUpload)

    this._app.get('/hello/:ok', function (req, res) {
      var ok = req.params.ok
      MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
        const dbo = db.db('tto')
        dbo.collection('pictures').find({name: ok}).toArray(function (err, result) {
          if (err) throw err
          console.log(result[0])
          res.send(result[0].img.buffer)
          db.close()
        })
      })
    })

    this._app.listen(10001)
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
      // console.log(database.getImage('dog3'))
      console.info('New Socket.IO Client Connection : ', socket.id)
      this.newClient(socket)

      socket.on('MESSAGE', () => {
        console.log('hello')
        socket.emit('test', 'hellollllll')
      })

      socket.on('get quizz', (data) => {
        if (data.type === 'table') {
          console.log('Client wants quizz of table')
          database.sendQuizToTable(socket)
        } else {
          console.log('Client wants quizz')
          database.sendQuizToPad(socket)
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

      socket.on(NEXT_QUESTION, (data) => {
        console.log(data)
        socket.broadcast.emit(PASS_TO_NEXT)
      })

      socket.on(QUIZ_FINISHED, (data) => {
        if (data.type === 'tangible') {
          console.log('quiz tangible finished')
        } else if (data.type === 'no tangible') {
          console.log('quiz no tangible finished')
        }
        socket.emit(QUIZ_FINISHED, data)
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

      socket.on('next question', (data) => {
        console.log('next question collaborative')
        socket.broadcast.emit('next question', data)
      })

      socket.on('lancer quiz collaborative', (data) => {
        console.log('lancer quiz collaborative')
        console.log(data)
        socket.broadcast.emit('start quiz collaborative', data)
      })

      socket.on('lancer quiz tangible', (data) => {
        console.log('lancer quiz tangible')
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
        // database.sendQuizTangible(socket)
      })

      socket.on('get quiz non tangible', () => {
        console.log('get quiz non tangible')
        // database.sendQuizNonTangible(socket)
      })

      socket.on('get profiles', () => {
        console.log('get profiles')
        database.sendProfiles(socket)
      })

      socket.on('add profile', (data) => {
        database.addProfile(data, socket)
      })

      socket.on('update profile', (data) => {
        for (let i = 0; i < data.length; i++) {
          console.log(data[i])
          database.updateProfiles(data[i])
        }
      })

      socket.on('get topics', () => {
        database.sendTopics(socket)
      })

      socket.on('add topic', (data) => {
        database.addTopic(data, socket)
      })

      socket.on('start fun quiz', (data) => {
        socket.broadcast.emit('fun quiz start', data)
      })

      socket.on('get musics', () => {
        database.sendMusics(socket)
      })

      socket.on('update topic', (data) => {
        console.log(data)
        database.updateTopics(data.quiz, data.id, socket)
      })

      socket.on('delete profile', (data) => {
        console.log('delete profile', data)
        database.deleteProfile(data.id)
      })

      socket.on('delete topic', (data) => {
        console.log('delete profile', data)
        database.deleteTopic(data.id)
      })

      socket.on('delete quiz', (data) => {
        console.log('delete quiz', data)
        database.deleteQuiz(data.id, data.type)
      })

      socket.on('modify quiz', (data) => {
        console.log('modify quiz', data)
      })

      socket.on('get profile by id', (data) => {
        console.log('get profile by id', data)
        database.getProfileById(data, socket)
      })

      socket.on('get topic by id', (data) => {
        console.log('get topic by id', data)
        database.getTopicById(data, socket)
      })

      socket.on('update profile detail', (data) => {
        console.log('update profile detail', data)
        database.updateProfilesDetail(data)
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
 * @param data: {type: 'collaborative', quiz: {}}
 * @param socket
 */

function addQuiz (data, socket) {
  if (data.type === 'collaborative') {
    database.addQuizCollaborative(data.quiz, socket)
  } else {
    database.addQuiz(data.quiz, socket)
  }
}

function getQuiz (data, socket) {
  switch (data.type) {
    case ALL_TYPES_QUIZZ:
      database.sendAllQuizz(socket)
      break
    case INDIVIDUEL_QUIZZ:
      break
    case COLLABORATIVE_QUIZZ:
      database.sendTableQuiz(socket)
      break
    case TANGIBLE_QUIZZ:
      database.sendQuizTangible(socket)
      break
    case NO_TANGIBLE_QUIZZ:
      database.sendQuizNonTangible(socket)
      break

  }
}

function startQuiz (data, socket) {
  switch (data.type) {
    case TANGIBLE_QUIZZ:
      socket.emit(TANGIBLE_QUIZZ, data.quiz)
      break
    case NO_TANGIBLE_QUIZZ:
      socket.emit(NO_TANGIBLE_QUIZZ, data.quiz)
      break
  }
}

export default SocketIOServer
