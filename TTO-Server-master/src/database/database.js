const MongoClient = require('mongodb').MongoClient
const urlDB = 'mongodb://localhost:27017/tto'
var quizs

class Database {
  init () {
    console.log('Initializing database...')
    const quizz = require('../../document/quizz')
    const questions = require('../../document/questions')
    const tableQuiz = require('../../document/tableQuiz')
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

      database.collection('questions').insertMany(questions, function (err, res) {
        if (err) throw err
        console.log(`inserted questions:${res.insertedCount}`)
        db.close()
      })
    })
  }

  sendAllQuizz (socket) {
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw  err
      const dbo = db.db('tto')
      dbo.collection('quizz').find({}).toArray(function (err, result) {
        if (err) throw  err
        socket.emit('all quizz', result)
        db.close()
      })
    })
  }

  sendAllQustions (socket) {
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw  err
      const dbo = db.db('tto')
      dbo.collection('questions').find({}).toArray(function (err, result) {
        if (err) throw  err
        socket.emit('all questions', result)
        db.close()
      })
    })
  }

  sendTableQuiz (socket) {
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw  err
      const dbo = db.db('tto')
      dbo.collection('tableQuiz').find({}).toArray(function (err, result) {
        if (err) throw  err
        socket.emit('all tableQuiz', result)
        db.close()
      })
    })
  }

  addQuiz (newQuiz) {
    MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
      if (err) throw err
      var dbo = db.db('tto')
      dbo.collection('quizz').insertOne(newQuiz, function (err, res) {
        if (err) throw err
        console.log('quiz inserted success')
        db.close()
      })
    })
  }

  closeDatabases () {
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw  err
      const dbo = db.db('tto')
      dbo.dropDatabase()
      dbo.close()
      console.log('dfsdf')
      process.exit(0)
    })
  }
}

module.exports = new Database()
