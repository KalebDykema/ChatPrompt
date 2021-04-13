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
  // If the key is enter, allows for multiple things to occur
  if(e.key == 'Enter') {
    // If the user is not focused on an input, then focuses on the relevant one
    if(ui.nameInput.style.display == '' && document.activeElement != ui.nameInput) ui.nameInput.focus()
    else if(ui.messageInput.style.display == '' && document.activeElement != ui.messageInput) ui.messageInput.focus()

    // If the nameInput has a value and is selected, sets that as the name and displays the messages and message input
    if(ui.nameInput.value.trim() != '' && document.activeElement == ui.nameInput){
      e.preventDefault()
      name = ui.nameInput.value.trim().replace(/ /g, '-')
      ui.nameInput.value = ''
      localCmds.checkForAndRunLocalCommand('/clear', ui)
      socket.emit('new user', name)

      // Gets rid of the name form and displays the messages and message form
      ui.nameForm.style.display = 'none'
      ui.nameInput.style.display = 'none'
      ui.messages.style.display = 'block'
      ui.messageForm.style.display = 'flex'
      ui.messageInput.focus()
      // If the messageInput has a value and is selected, emits a message to the server
    } else if(ui.messageInput.value.trim() != ''&& document.activeElement == ui.messageInput){
      e.preventDefault()
      // Makes sure the input is not a command for the local client. If it is, run it. If not, send it to the server
      if(ui.messageInput.value.trim().charAt(0) != '/' || !localCmds.checkForAndRunLocalCommand(ui.messageInput.value.trim(), ui)){
        socket.emit('chat message', ui.messageInput.value.trim())
      }
      // Reset the messageInput
      ui.messageInput.value = '';
    }
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

// On Name in Use Received
socket.on('name-in-use', function(){
  ui.showNameInUse()
})