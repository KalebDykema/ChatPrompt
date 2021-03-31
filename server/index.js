// Server Objects
let express = require('express')
let app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const cmd = require('./commands.js')

// Sends the HTML, CSS, and JS files to the client
app.use('/css', express.static(process.cwd() + '/dist/css'));
app.use('/js', express.static(process.cwd() + '/dist/js'));
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/dist/index.html')
})

// Listen for different sockets after the user connects
io.on('connection', (socket) => {
  // Disconnect
  socket.on('disconnect', () => {
    io.emit('user disconnected', socket.user)
  })

  // New User
  socket.on('new user', (name) => {
    socket.user = name
    socket.join(socket.user);
    io.emit('new user', name)
  })

  // Chat Message
  socket.on('chat message', (name, msg) => {
    // Commands
    if(msg.charAt(0) == '/'){
      let results = cmd.runCommand(msg)
      // If the command is only a client side one, only returns to the appropriate user
      if(results.split(' ')[0] == 'client'){
        io.to(socket.user).emit('chat message', name, results.substring(results.indexOf(' ')+1))
      } else {
        io.emit('chat message', name, results)
      }
      // Message
    } else io.emit('chat message', name, msg)
  })
  
  // Is Typing
  socket.on('typing', (name, msg) => {
    io.emit('typing', name, msg)
  })
})

// Tell the server to run on port 3000
http.listen(3000, () => {
  console.log('listening on *:3000')
})