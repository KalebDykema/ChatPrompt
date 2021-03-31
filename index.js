// Server Objects
var express = require('express')
var app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

// Sends the CSS and JS files to the client
app.use('/css', express.static(__dirname + '/dist/css'));
app.use('/js', express.static(__dirname + '/dist/js'));

// Send the HTML index to the client
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html')
})

// Listen for different sockets after the user connects
io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
  socket.on('chat message', (name, msg) => {
    io.emit('chat message', name, msg)
  })
  socket.on('typing', (name, msg) => {
    io.emit('typing', name, msg)
  })
})

// Tell the server to run on port 3000
http.listen(3000, () => {
  console.log('listening on *:3000')
})