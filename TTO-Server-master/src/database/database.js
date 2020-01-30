const MongoClient = require('mongodb').MongoClient
const urlDB = 'mongodb://localhost:27017/tto'
var quizs

class Database {
  init () {
    console.log('Initializing database...')
    const quizz = require('../../document/quizz')
    const questions = require('../../document/questions')
    const tableQuiz = require('../../document/tableQuiz')
    const images = require('../../document/images')
    const quizTangible = require('../../document/quizTangible')
    const quizNontangible = require('../../document/quizNontangible')
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw err
      console.log('database created')
      const database = db.db('tto')
      database.collection('quizz').insertMany(quizz, function (err, res) {
        if (err) throw err
        console.log(`inserted quiz:${res.insertedCount}`)
      })

      database.collection('tableQuiz').insertMany(tableQuiz, function (err, res) {
        if (err) throw err
        console.log(`inserted table quiz:${res.insertedCount}`)
      })

      database.collection('images').insertMany(images, function (err, res) {
        if (err) throw err
        console.log(`inserted images:${res.insertedCount}`)
      })

      database.collection('quizTangible').insertMany(quizTangible, function (err, res) {
        if (err) throw err
        console.log(`inserted quizTangible:${res.insertedCount}`)
      })

      database.collection('quizNontangible').insertMany(quizNontangible, function (err, res) {
        if (err) throw err
        console.log(`inserted quizNontangible:${res.insertedCount}`)
      })

      database.collection('questions').insertMany(questions, function (err, res) {
        if (err) throw err
        console.log(`inserted questions:${res.insertedCount}`)
        db.close()
      })
    })
  }

  sendPadQuizz (socket) {
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw err
      const dbo = db.db('tto')
      dbo.collection('quizz').find({}).toArray(function (err, result) {
        if (err) throw err
        socket.emit('all quizz', result)
        db.close()
      })
    })
  }

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

  sendQuizTangible (socket) {
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw err
      const dbo = db.db('tto')
      dbo.collection('quizTangible').find({}).toArray(function (err, result) {
        if (err) throw err
        socket.emit('quiz tangible', result)
        db.close()
      })
    })
  }

  sendQuizNonTangible (socket) {
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw err
      const dbo = db.db('tto')
      dbo.collection('quizNontangible').find({}).toArray(function (err, result) {
        if (err) throw err
        socket.emit('quiz non tangible', result)
        db.close()
      })
    })
  }

  sendAllQuizz (socket) {
    let results = {
      individuel: [],
      collaborative: []
    }
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw err
      const dbo = db.db('tto')
      dbo.collection('quizz').find({}).toArray(function (err, result) {
        if (err) throw err
        results.individuel = result
      })
      dbo.collection('tableQuiz').find({}).toArray(function (err, result) {
        if (err) throw err
        results.collaborative = result
        socket.emit('all types quiz', results)
        db.close()
      })
    })
  }

  sendAllQustions (socket) {
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw err
      const dbo = db.db('tto')
      dbo.collection('questions').find({}).toArray(function (err, result) {
        if (err) throw err
        socket.emit('all questions', result)
        db.close()
      })
    })
  }

  sendTableQuiz (socket) {
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw err
      const dbo = db.db('tto')
      dbo.collection('tableQuiz').find({}).toArray(function (err, result) {
        if (err) throw err
        socket.emit('all tableQuiz', result)
        db.close()
      })
    })
  }

  addQuiz (newQuiz, socket) {
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw err
      var dbo = db.db('tto')
      dbo.collection('quizz').insertOne(newQuiz, function (err, res) {
        if (err) throw err
        console.log('quiz inserted success')
        socket.emit('quiz added', {type: true})
        db.close()
      })
    })
  }

  addQuizCollaborative (newQuiz, socket) {
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw err
      var dbo = db.db('tto')
      dbo.collection('tableQuiz').insertOne(newQuiz, function (err, res) {
        if (err) throw err
        console.log('quiz collaborative inserted success')
        socket.emit('quiz collaborative added', {type: true})
        db.close()
      })
    })
  }

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
