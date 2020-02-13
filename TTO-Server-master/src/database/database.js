const MongoClient = require('mongodb').MongoClient
const fs = require('fs-extra')
const urlDB = 'mongodb://localhost:27017/tto'
var quizs
const ObjectId = require('mongodb').ObjectId

class Database {
  init () {
    console.log('Initializing database...')
    const images = require('../../document/images')
    const profiles = require('../../document/profiles')
    const personalQuiz = require('../../document/quizPersonal')
    const topics = require('../../document/topics')
    const quizHandsMove = require('../../document/quizHandsMove')
    const quizHandsTouch = require('../../document/quizHandsTouch')
    const musics = require('../../document/music')
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw err
      console.log('database created')
      const database = db.db('tto')
      /**
       * insert personal quiz
       */
      database.collection('personalQuiz').insertMany(personalQuiz, function (err, res) {
        if (err) throw err
        console.log(`Inserted personal quiz:${res.insertedCount}`)
      })

      /**
       * insert topics
       */
      database.collection('topic').insertMany(topics, function (err, res) {
        if (err) throw err
        console.log(`Inserted topics:${res.insertedCount}`)
      })

      /**
       * insert quiz - HandsMove
       */
      database.collection('quizHandsMove').insertMany(quizHandsMove, function (err, res) {
        if (err) throw err
        console.log(`Inserted quiz hands move:${res.insertedCount}`)
      })

      /**
       * insert quiz - HandsTouch
       */
      database.collection('quizHandsTouch').insertMany(quizHandsTouch, function (err, res) {
        if (err) throw err
        console.log(`Inserted quiz hands touch:${res.insertedCount}`)
      })

      /**
       * insert images
       */
      database.collection('images').insertMany(images, function (err, res) {
        if (err) throw err
        console.log(`inserted images:${res.insertedCount}`)
      })

      /**
       * insert profiles
       */
      database.collection('profiles').insertMany(profiles, function (err, res) {
        if (err) throw err
        console.log(`inserted profiles:${res.insertedCount}`)
      })

      /**
       * insert profiles
       */
      database.collection('music').insertMany(musics, function (err, res) {
        if (err) throw err
        console.log(`inserted musics:${res.insertedCount}`)
      })

    })
  }

  /**
   * quiz on touch pad only
   * @param socket
   */
  sendQuizToPad (socket) {
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw err
      const dbo = db.db('tto')
      dbo.collection('personalQuiz').find({}).toArray(function (err, result) {
        if (err) throw err
        socket.emit('personal quiz', result)
        db.close()
      })
    })
  }

  /**
   * send images
   * @param socket
   */
  sendImages (socket) {
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw err
      const dbo = db.db('tto')
      dbo.collection('images').find({}).toArray(function (err, result) {
        if (err) throw err
        socket.emit('images', result)
        db.close()
      })
    })
  }

  /**
   * send profiles
   * @param socket
   */
  sendProfiles (socket) {
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw err
      const dbo = db.db('tto')
      dbo.collection('profiles').find({}).toArray(function (err, result) {
        if (err) throw err
        socket.emit('all profiles', result)
        db.close()
      })
    })
  }

  /**
   * send all the quiz
   * @param socket
   */
  sendAllQuizz (socket) {
    let results = {
      personal: [],
      collaborative: {
        handsMove: [],
        handsTouch: []
      }
    }
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw err
      const dbo = db.db('tto')
      dbo.collection('personalQuiz').find({}).toArray(function (err, result) {
        if (err) throw err
        results.personal = result
      })

      dbo.collection('quizHandsTouch').find({}).toArray(function (err, result) {
        if (err) throw err
        results.collaborative.handsTouch = result
      })

      dbo.collection('quizHandsMove').find({}).toArray(function (err, result) {
        if (err) throw err
        results.collaborative.handsMove = result
        socket.emit('all types quiz', results)
        db.close()
      })
    })
  }

  /**
   * send topics
   * @param socket
   */
  sendTopics(socket){
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw err
      const dbo = db.db('tto')
      dbo.collection('topic').find({}).toArray(function (err, result) {
        if (err) throw err
        socket.emit('all topics', result)
        db.close()
      })
    })
  }

  /**
   * send quiz to table
   * @param socket
   */
  sendQuizToTable (socket) {
    let results = {
      handsMove: [],
      handsTouch: []
    }
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw err
      const dbo = db.db('tto')
      dbo.collection('quizHandsTouch').find({}).toArray(function (err, result) {
        if (err) throw err
        results.handsTouch = result
      })

      dbo.collection('quizHandsMove').find({}).toArray(function (err, result) {
        if (err) throw err
        results.handsMove = result
        socket.emit('quiz for table', results)
        db.close()
      })
    })
  }

  addQuiz (newQuiz, socket) {
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw err
      var dbo = db.db('tto')
      dbo.collection('personalQuiz').insertOne(newQuiz, function (err, res) {
        if (err) throw err
        console.log('quiz inserted success')
        socket.emit('quiz added', {type: true})
        db.close()
      })
    })
  }

  addTopic (newTopic, socket) {
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw err
      var dbo = db.db('tto')
      dbo.collection('topic').insertOne(newTopic, function (err, res) {
        if (err) throw err
        console.log('topic inserted success')
        socket.emit('topic added', {type: true})
        db.close()
      })
    })
  }

  /**
   *
   * @param newProfile
   * @param socket
   */

  addProfile (newProfile, socket) {
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw err
      var dbo = db.db('tto')
      dbo.collection('profiles').insertOne(newProfile, function (err, res) {
        if (err) throw err
        console.log('new profile inserted success')
        socket.emit('profile added', {type: true})
        db.close()
      })
    })
  }

  /**
   * add quiz collaborative
   * @param data
   * @param socket
   * {type: , quiz: nre colla}
   */
  addQuizCollaborative (data, socket) {
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw err
      var dbo = db.db('tto')
      if(data.type ==="handsMove"){
        dbo.collection('quizHandsMove').insertOne(data.quiz, function (err, res) {
          if (err) throw err
          console.log('quiz quizHandsMove inserted success')
          socket.emit('quiz hands move added', {type: true})
          db.close()
        })
      }else if(data.type === "handsTouch"){
        dbo.collection('quizHandsTouch').insertOne(data.quiz, function (err, res) {
          if (err) throw err
          console.log('quiz quizHandsTouch inserted success')
          socket.emit('quiz hands touch added', {type: true})
          db.close()
        })
      }
    })
  }

  /**
   * update profile
   * @param newProfile
   */
  updateProfiles (newProfile) {
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw err
      var dbo = db.db('tto')
      var searchId = {id: newProfile.id}
      var updateQuiz = {$set: {quizAccessible: newProfile.quizAccessible}}
      dbo.collection('profiles').updateOne(searchId, updateQuiz, function (err, res) {
        if (err) throw err
        console.log('Update profiles success')
        db.close()
      })
    })
  }

  /**
   *
   */
  closeDatabases () {
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw err
      const dbo = db.db('tto')
      dbo.dropDatabase()
      dbo.close()
      console.log('dfsdf')
      process.exit(0)
    })
  }
}
module.exports = new Database()
