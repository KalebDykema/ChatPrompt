// Server Objects
let express = require('express')
let app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const cmd = require('./commands/commands.js')

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
    io.to(socket.user).emit('command', name, ['client', 'Type /help or / for commands.'])
  })

  // Chat Message
  socket.on('chat message', (name, msg) => {
    // Commands
    if(msg.charAt(0) == '/'){
      let results = cmd.runCommand(msg)
      // Checks if the results are an array, meaning it has multiple paramaters to sort through
      if(typeof(results) == 'object'){
        // Client Only
        if(results[0] == 'client'){
          io.to(socket.user).emit('command', name, results)
        // Whisper
        } else if(results[0] == 'whisper'){
          io.to(results[1]).emit('whisper', name, results[2])
          io.to(socket.user).emit('whisper', name, results[2])
        }
      }
      else {
        io.emit('command', name, results)
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