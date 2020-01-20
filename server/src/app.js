const io = require('socket.io-client')
//First Connect to the Server on the Specific URL (HOST:PORT)
let socket = io('http://localhost:10000/')
//Now Listen for Events (welcome event).
// socket.on("welcome", (data) => {
//   /*For the listener we specify the event name and we give the callback to which be called one the
//   event is emitted*/
//   //Log the Welcome message
//   console.log("Message: ", data);
//   socket.emit('message', 'Message from client')
// });

socket.on('PING', (data) => {
  console.log(data)
  console.log(`Received PING from ${data.id}!`)
  // socket.emit('PONG', {id: 'Web'})

  socket.emit('MESSAGE', {id: 'hello world'})
})

socket.on('test', (data) => {
  console.log(data)
  socket.emit('get quizz')
})

socket.on('all quizz', (data) => {
  console.log(data)
})





