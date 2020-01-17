const io = require("socket.io-client");
//First Connect to the Server on the Specific URL (HOST:PORT)
let socket = io("http://172.20.10.2:3000");
//Now Listen for Events (welcome event).
socket.on("welcome", (data) => {
  /*For the listener we specify the event name and we give the callback to which be called one the
  event is emitted*/
  //Log the Welcome message
  console.log("Message: ", data);
  socket.emit('message', 'Message from client')
});


