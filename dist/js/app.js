// Socket Object
let socket = io()

// Local Name Variable
let name = 'N/A'

// DOM Objects
let nameForm = document.getElementById('enter-name')
let nameInput = document.getElementById('input-name')
let messages = document.getElementById('chat-history')
let messageForm = document.getElementById('send-message')
let messageInput = document.getElementById('input-message')

// General Functions
// If there's any typing messages from other users, push them under the new user message
function appendTypingMessages(){
  if(messages.querySelectorAll('.typing')){
    messages.querySelectorAll('.typing').forEach((typingMsg) => {
      messages.appendChild(typingMsg)
    })
  }
}
// Adds new message to chat log
function addNewMessage(element, classes, text){
  let item = document.createElement(element)
  item.classList = classes
  item.textContent = text
  messages.appendChild(item)
  appendTypingMessages()
  messages.scrollTo(0, messages.scrollHeight)
}
// Looks to see if the user is typing and emits that to the server
function emitTypingIfUserIsTyping(){
  if(nameForm.style.display == 'none'){ 
    socket.emit('typing', name, messageInput.value)
  }
}

// Key Down Listener
document.onkeydown = function(e){
  // Looks if Enter is clicked and then saves a chosen name to a local variable
  if(e.key == 'Enter' && nameInput.value.trim() != ''){
    e.preventDefault()
    name = nameInput.value.trim()
    nameInput.value = ''
    socket.emit('new user', name)

    // Gets rid of the name form and displays the messages and message form
    nameForm.style.display = 'none'
    messages.style.display = 'block'
    messageForm.style.display = 'flex'
    // Looks if Enter is clicked and then emits a message to the server
  } else if(e.key == 'Enter' && messageInput.value.trim() != ''){
    e.preventDefault()
    socket.emit('chat message', name, messageInput.value.trim())
    messageInput.value = '';
  }

  emitTypingIfUserIsTyping()
}

// Key Up Listener
document.onkeyup = function(){
  emitTypingIfUserIsTyping()
}

// On New User Socket Received
socket.on('new user', function(name) {
  addNewMessage('p', 'new-user', name + ' has joined')
})

// On User Disconnected Socket Received
socket.on('user disconnected', function(user){
  if(messages.querySelector(`.typing.${user}`)) {
    messages.querySelector(`.typing.${user}`).remove()
  }
  addNewMessage('p', 'user-disconnected', user + ' has disconnected')
})

// On Chat Message Socket Received
socket.on('chat message', function(name, msg) {
  // If there's a typing message for the user, removes it
  if(messages.querySelectorAll('.typing')){
    messages.querySelector(`.${name}`).remove()
  }
  // Create the message element and display it to the dom
  addNewMessage('pre', 'message', '> ' + name + ': ' + msg)
})

// On Typing Socket Received
socket.on('typing', function(name, msg) {
  // If the user doesn't already have a typing message, creates one and displays it in the DOM
  if(!messages.querySelector(`.typing.${name}`) && msg != ''){
    addNewMessage('p', `typing ${name}`, `${name} is typing`)
    // If the user's message field is now empty, removes their typing message form the DOM 
  } else if(messages.querySelector(`.typing.${name}`) && msg == '') {
    messages.querySelector(`.typing.${name}`).remove()
  }
})