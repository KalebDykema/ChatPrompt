import * as ui from './uictrl.js'
import * as localCmds from './localcommands/localcommandsctrl.js'

// Socket Objects
const socket = io()

// Local Name Variables
let name = 'N/A'

// Looks to see if the user is typing and emits that to the server
function emitTypingIfChatIsDisplayed(){
  if(ui.nameForm.style.display == 'none'){ 
    socket.emit('typing', ui.messageInput.value)
  }
}

// Key Down Listener
document.onkeydown = function(e){
  // Looks if Enter is clicked and then saves a chosen name to a local variable
  if(e.key == 'Enter' && ui.nameInput.value.trim() != ''){
    e.preventDefault()
    name = ui.nameInput.value.trim().replace(/ /g, '-')
    ui.nameInput.value = ''
    localCmds.checkForAndRunLocalCommand('/clear', ui)
    socket.emit('new user', name)

    // Gets rid of the name form and displays the messages and message form
    ui.nameForm.style.display = 'none'
    ui.messages.style.display = 'block'
    ui.messageForm.style.display = 'flex'
    ui.messageInput.focus()
    // Looks if Enter is clicked and then emits a message to the server
  } else if(e.key == 'Enter' && ui.messageInput.value.trim() != ''){
    e.preventDefault()
    // Makes sure the input is not a command for the local client
    if(ui.messageInput.value.trim().charAt(0) != '/' || !localCmds.checkForAndRunLocalCommand(ui.messageInput.value.trim(), ui)){
      socket.emit('chat message', ui.messageInput.value.trim())
    }
    ui.messageInput.value = '';
  }

  emitTypingIfChatIsDisplayed()
}

// Key Up Listener
document.onkeyup = function(){
  emitTypingIfChatIsDisplayed()
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
  ui.checkForAndRemoveTypingMessage(ui)
  ui.addNewMessage('pre', 'message', '> ' + name + ': ' + msg)
})

// On Client Command Socket Received
socket.on('client-command', function(results) {
  ui.checkForAndRemoveTypingMessage()
  ui.addNewMessage('p', 'client', results)
})

// On Whisper Socket Received
socket.on('whisper', function(otherPersonName, msg){
  ui.checkForAndRemoveTypingMessage()
  ui.addNewMessage('pre', 'whisper', '> ' + otherPersonName + ': ' + msg)
  socket.emit('last-messaged', otherPersonName)
})

// On Name Change Socket Received
socket.on('name-change', function(oldName, newName){
  ui.checkForAndRemoveTypingMessage()
  name = newName
  ui.addNewMessage('pre', 'name-change', `${oldName} has changed their name to ${newName}`)
})

// On Typing Socket Received
socket.on('typing', function(name, msg) {
  // If the user doesn't already have a typing message, creates one and displays it in the DOM
  if(!ui.messages.querySelector(`.typing.${name}`) && msg != ''){
    ui.addNewMessage('p', `typing ${name}`, `${name} is typing`)
    // If the user's message field is now empty, removes their typing message from the DOM 
  } else if(ui.messages.querySelector(`.typing.${name}`) && msg == '') {
    ui.messages.querySelector(`.typing.${name}`).remove()
  }
})