const express = require('express')
const routes = require('./routes');
require('dotenv').config()
require('./config/database')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH"],
  }
})
const Message = require('./models/message')

var bodyParser = require('body-parser');
const { saveMessage } = require('./services/message.service')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const port = process.env.PORT || 3000

app.use('/', routes);

io.on('connection', socket => {
  console.log('socket connection')
  //Get the chatID of the user and join in a room of the same chatID

  console.log(socket.handshake.query)
  const chatID = socket.handshake.query.chatID
  socket.join(chatID)


  //Leave the room if the user closes the socket
  socket.on('disconnect', () => {
    console.log('disconnected from socket');
    socket.leave(chatID)
  })

  //Send message to only a particular user
  socket.on('send_message', data => {
    const discussion = JSON.parse(data)
    // console.log('message arrived', discussion.sender.id)
    console.log('message arrived', discussion.receiver, chatID, discussion.receiver === chatID)
    io.to(discussion.receiver).emit('receive_message', discussion)
  })
});

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

http.listen(port, () => {
  console.log(`Avocat depoch app listening on port ${port}`)
})