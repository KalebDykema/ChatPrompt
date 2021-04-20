// Server Objects
let express = require('express')
let app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const cmd = require('./commands/commandsctrl.js')

// Server Variables
let users = {}
let usernames = []
let usernamesLowerCased = []
let invalidCharacters = ['~', '!', '@', '$', '%', '^', '&', '*', '(', ')', '+', '=', ',', '.', '/', "'", ';', ':', '"', '?', '>', '<', '[', ']', '\\', '{', '}', '|', '`', '#', ' ']

// Updates the user in all server variables
function updateUser(username, socket){
  socket.user = username
  users[socket.id] = username
  usernames = Object.values(users)
  usernamesLowerCased = usernames.map(username => username.toLowerCase())
}

// Removes the user from all server variables
function removeUser(socket){
  delete users[socket.id]
  usernames = Object.values(users)
  usernamesLowerCased = usernames.map(username => username.toLowerCase())
}

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
    // Emit a disconnect message and remove them from the user array, but only if they have a name
    if(socket.user != null){
      io.emit('user disconnected', socket.user)
      removeUser(socket)
    }
  })

  // New User
  socket.on('new user', (name) => {
    let username = name.toString().trim()
    let usernameLowerCased = username.toLowerCase()
    let invalidUsername = false

    // Make sure username doesn't have invalid characters
    for(i = 0; i < usernameLowerCased.length; i++){
      if(invalidCharacters.includes(usernameLowerCased.charAt(i))){
        io.to(socket.user).emit('invalid-name')
        invalidUsername = true
        console.log(invalidUsername)
        break 
      }
    }

    // If the username has no invalid characters
    if(!invalidUsername){
      // Make sure name is not already being used
      if(usernamesLowerCased.includes(usernameLowerCased)){
        io.to(socket.user).emit('name-in-use')
      } else {
        socket.join(socket.user)
        updateUser(username, socket)

        socket.lastMessaged = ''
        socket.join(socket.lastMessaged)
        
        io.emit('new user', socket.user)
        io.to(socket.id).emit('client-command', 'Type /help or / for commands.')
      }
    }
  })

  // Chat Message
  socket.on('chat message', (msg) => {
    // Commands
    if(msg.charAt(0) == '/'){
      let results = cmd.runCommand(msg, usernames, socket.lastMessaged)
      // Checks if the results are an array, meaning it has multiple paramaters to sort through
      if(typeof(results) == 'object'){
        // Client Only
        if(results[0] == 'client'){
          io.to(socket.id).emit('client-command', results[1])
          // Name-Change
        } else if(results[0] == 'name-change'){
          // Change name and update in users array
          const oldName = socket.user
          updateUser(results[1], socket)

          io.emit('name-change', oldName, socket.user)
          // Just emits typing to get rid of the old message
          io.emit('typing', oldName, '')
          // Whisper
        }else if(results[0] == 'whisper'){
          socket.lastMessaged = results[1]
          io.to(socket.lastMessaged).emit('whisper', socket.user, results[2])
          io.to(socket.id).emit('whisper', `To ${socket.lastMessaged}`, results[2])
          // Reply
        } else if(results[0] == 'reply'){
          io.to(socket.lastMessaged).emit('whisper', socket.user, results[1])
          io.to(socket.id).emit('whisper', `To ${socket.lastMessaged}`, results[1])
        }
        // Command
      } else io.emit('chat message', socket.user, results)
      // Message
    } else io.emit('chat message', socket.user, msg)
  })

  // Updates lastMessaged
  socket.on('last-messaged', (name) => socket.lastMessaged = name)

  // Is Typing
  socket.on('typing', (msg) => io.emit('typing', socket.user, msg))
})

// Tell the server to run on port 3000
http.listen(3000, () => {
  console.log('listening on *:3000')
})