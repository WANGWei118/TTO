const express = require('express')
const app = express()
const port = 3000
const http = require('http').createServer()

const io = require('socket.io')(http)

io.on('connection', (socket) => {
  //Socket is a Link to the Client
  console.log('New Client is Connected!')
  //Here the client is connected and we can exchanged
  const testJson = {
    id: 1,
    name: 'wangwei',
    machine: 'socketIO'
  }
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
