// Server Objects
var express = require('express')
var app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

// General Functions
// Runs a command
function runCommand(cmd){
  cmd = cmd.substring(cmd.indexOf('/')+1)
  initCmd = cmd.split(' ')[0]
  secondCmd = cmd.substring(cmd.indexOf(' ')+1)

  // Roll Dice Command
  if(initCmd == 'roll' || initCmd == 'r'){
    return rollDice(secondCmd)
  }
}
// Roll Dice
function rollDice(rollCmd){
  const roll = rollCmd
  let numberOfDice
  let die
  let result = 0
  let rolls = []
  let rollsString = ''
  
  // If it starts with d, just rolls one die
  if(roll.charAt(0) == 'd' || roll.charAt(0) == '1'){
    die = parseInt(roll.substring(roll.indexOf('d')+1))
    result = Math.round(Math.random() * (die - 1) + 1)
    return `1d${die} (${result})`
    // If it starts with a number and has a d after it, rolls that many die
  } else if(parseInt(roll.charAt(0))){
    numberOfDice = parseInt(roll.charAt(0))
    die = parseInt(roll.substring(roll.indexOf('d')+1))
    for (i = 0; i < numberOfDice; i++) {
      rolls[i] = Math.round(Math.random() * (die - 1) + 1)
      if(i == numberOfDice - 1) rollsString = rollsString.concat(`${rolls[i]}`)
      else rollsString = rollsString.concat(`${rolls[i]} + `)
      result += rolls[i]
    }
    return `${numberOfDice}d${die} (${result} = ${rollsString})`
  }
}

// Sends the HTML, CSS, and JS files to the client
app.use('/css', express.static(__dirname + '/dist/css'));
app.use('/js', express.static(__dirname + '/dist/js'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html')
})

// Listen for different sockets after the user connects
io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('disconnect', () => {
    console.log('a user disconnected')
    io.emit('user disconnected', socket.user)
  })
  socket.on('new user', (name) => {
    socket.user = name
    io.emit('new user', name)
  })
  socket.on('chat message', (name, msg) => {
    if(msg.charAt(0) == '/'){
      io.emit('chat message', name, runCommand(msg))
    } else io.emit('chat message', name, msg)
  })
  socket.on('typing', (name, msg) => {
    io.emit('typing', name, msg)
  })
})

// Tell the server to run on port 3000
http.listen(3000, () => {
  console.log('listening on *:3000')
})