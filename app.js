const express = require('express')
const routes = require('./src/routes');
require('dotenv').config()
require('./src/config/database')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH"],
  }
})

//importation des routes
const droitRoute = require('./src/routes/droit.routes');
const userRoute = require('./src/routes/user.routes');

var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

const port = process.env.PORT || 3000

app.use('/', routes);

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist/app-avocat-depoch/index.html'))
// })

//liste des routes pour l'application
app.use('/api/', droitRoute)
app.use('/api/', userRoute)

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

http.listen(port, () => {
  console.log(`Avocat depoch app listening on port ${port}`)
})