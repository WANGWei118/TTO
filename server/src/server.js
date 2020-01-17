const express = require('express')
const app = express()
const port = 3000
const http = require('http').createServer()
const MongoClient = require('mongodb').MongoClient
const urlDB = 'mongodb://localhost:27017/tto'

const io = require('socket.io')(http)

MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
  if (err) throw  err
  console.log('database created')
  const database = db.db('tto')
  const quiz = {
    name: 'quiz 1'
  }
  // database.createCollection('quizz', function (err, res) {
  //   if (err) throw err;
  //   console.log('collection created')
  //   db.close();
  // })

  database.collection('quizz').insertOne(quiz, function (err, res) {
    if (err) throw err
    console.log('inserted quiz')
    db.close()
  })

})

io.on('connection', (socket) => {
  //Socket is a Link to the Client
  console.log('New Client is Connected!')
  //Here the client is connected and we can exchanged
  const testJson = {
    id: 1,
    name: 'wangwei',
    machine: 'socketIO'
  }

  MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
    if (err) throw  err
    const dbo = db.db('tto')
    dbo.collection('quizz').find({}).toArray(function (err, result) {
      if (err) throw  err
      console.log(result)
      socket.emit('quizz', result)
      db.close()
    })
  })


  socket.emit('welcome', testJson)

  socket.on('message', (data) => {
    console.log('New message')
    console.log(data)
    socket.emit('message received', 'ok')
  })

})

//Listen the HTTP Server
http.listen(port, () => {
  console.log('Server Is Running Port: ' + port)
})

process.on('SIGINT', () => {
  console.log('SIGINT: Closing MongoDB connection');
  MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
    if(err) throw  err;
    const dbo = db.db('tto');
    dbo.dropDatabase();
    dbo.close()
    console.log('dfsdf')
    process.exit(0)
  })
})

