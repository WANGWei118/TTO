const MongoClient = require('mongodb').MongoClient
const fs = require('fs-extra')
const urlDB = 'mongodb://localhost:27017/tto'
var quizs
const ObjectId = require('mongodb').ObjectId
class Database {
  init () {
    console.log('Initializing database...')
    const quizz = require('../../document/quizz')
    const questions = require('../../document/questions')
    const tableQuiz = require('../../document/tableQuiz')
    const quizTangible = require('../../document/quizTangible')
    const quizNontangible = require('../../document/quizNontangible')
    const images = require('../../document/images')
    const imagesTemp = require('../../document/pictures')
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

      database.collection('images').insertMany(imagesTemp, function (err, res) {
        if (err) throw err
        console.log(`inserted images:${res.insertedCount}`)
      })

      database.collection('quizTangible').insertMany(quizTangible, function (err, res) {
        if (err) throw err
        console.log(`inserted quizTangible:${res.insertedCount}`)
      })

      // for(let image of images){
      //   var newImg = fs.readFileSync(image.src)
      //   var encImg = newImg.toString('base64')
      //   var newItem = {
      //     id: image.id,
      //     name: image.description,
      //     img: Buffer(encImg, 'base64')
      //   }
      //
      //   database.collection('pictures').insert(newItem, function (err, result) {
      //     if (err) {console.log(err)}
      //     var newid = new ObjectId(result.ops[0]._id)
      //     fs.remove(image.src, function (err) {
      //       if(err) {console.log(err)}
      //       console.log('Picture inserted')
      //     })
      //   })
      // }

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
      collaborative: [],
      tangible: [],
      nonTangible: []
    }
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      if (err) throw err
      const dbo = db.db('tto')
      dbo.collection('quizz').find({}).toArray(function (err, result) {
        if (err) throw err
        results.individuel = result
      })

      dbo.collection('quizTangible').find({}).toArray(function (err, result) {
        if (err) throw err
        results.tangible = result
      })

      dbo.collection('quizNontangible').find({}).toArray(function (err, result) {
        if (err) throw err
        results.nonTangible = result
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

  getImage (imageName) {
    MongoClient.connect(urlDB, {useNewUrlParser: true}, function (err, db) {
      const dbo = db.db('tto')
      dbo.collection('pictures').find({}).toArray(function (err, result) {
        if (err) throw err
        console.log(result)
        db.close()
      })
    })

  }
}

function uploadImages (image, database) {
  var newImg = fs.readFileSync(image.src)
  var encImg = newImg.toString('base64')
  var newItem = {
    name: image.description,
    img: Buffer(encImg, 'base64')
  }

  database.collection('pictures').insert(newItem, function (err, result) {
    if (err) {console.log(err)}
    console.log('inserted image')
  })
}

module.exports = new Database()
