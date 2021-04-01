import * as ui from './uictrl.js'
import * as localCmds from './localcommands.js'

// Socket Object
const socket = io()
// Local Name Variable
let name = 'N/A'
// Looks to see if the user is typing and emits that to the server
function emitTypingIfUserIsTyping(){
  if(ui.nameForm.style.display == 'none'){ 
    socket.emit('typing', name, ui.messageInput.value)
  }
}

// Key Down Listener
document.onkeydown = function(e){
  // Looks if Enter is clicked and then saves a chosen name to a local variable
  if(e.key == 'Enter' && ui.nameInput.value.trim() != ''){
    e.preventDefault()
    name = ui.nameInput.value.trim()
    ui.nameInput.value = ''
    socket.emit('new user', name)

    // Gets rid of the name form and displays the messages and message form
    ui.nameForm.style.display = 'none'
    ui.messages.style.display = 'block'
    ui.messageForm.style.display = 'flex'
    // Looks if Enter is clicked and then emits a message to the server
  } else if(e.key == 'Enter' && ui.messageInput.value.trim() != ''){
    e.preventDefault()
    // Makes sure the input is not a command for the local client
    if(ui.messageInput.value.trim().charAt(0) != '/' || !localCmds.checkForAndRunLocalCommand(ui.messageInput.value.trim(), ui)){
      socket.emit('chat message', name, ui.messageInput.value.trim())
    }
    ui.messageInput.value = '';
  }

  emitTypingIfUserIsTyping()
}

// Key Up Listener
document.onkeyup = function(){
  emitTypingIfUserIsTyping()
}

// On New User Socket Received
socket.on('new user', function(name) {
  ui.addNewMessage('p', 'new-user', name + ' has joined')
})

// On User Disconnected Socket Received
socket.on('user disconnected', function(user){
  if(ui.messages.querySelector(`.typing.${user}`)) {
    ui.messages.querySelector(`.typing.${user}`).remove()
  }
  ui.addNewMessage('p', 'user-disconnected', user + ' has disconnected')
})

// On Chat Message Socket Received
socket.on('chat message', function(name, msg) {
  // If there's a typing message for the user, removes it
  if(ui.messages.querySelectorAll('.typing') == true){
    ui.messages.querySelector(`.${name}`).remove()
  }
  // If if it's command meant for the client, give it a different styling 
  if(msg.split(' ')[0] == 'client-cmd'){
    ui.addNewMessage('p', 'cmd', msg.substring(msg.indexOf(' ')+1))
    // Create the message element and display it to the dom
  } else ui.addNewMessage('pre', 'message', '> ' + name + ': ' + msg)
})

// On Typing Socket Received
socket.on('typing', function(name, msg) {
  // If the user doesn't already have a typing message, creates one and displays it in the DOM
  if(!ui.messages.querySelector(`.typing.${name}`) && msg != ''){
    ui.addNewMessage('p', `typing ${name}`, `${name} is typing`)
    // If the user's message field is now empty, removes their typing message form the DOM 
  } else if(ui.messages.querySelector(`.typing.${name}`) && msg == '') {
    ui.messages.querySelector(`.typing.${name}`).remove()
  }
})