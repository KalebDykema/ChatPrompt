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

// Key Down Listener
document.onkeydown = function(e){
  // Looks if Enter is clicked and then saves a chosen name to a local variable
  if(e.key == 'Enter' && nameInput.value.trim() != ''){
    e.preventDefault()
    name = nameInput.value.trim()
    nameInput.value = ''

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

  // Looks to see if the user is typing and emits that to the server
  if(nameForm.style.display == 'none' && messageInput.value != ''){ 
    socket.emit('typing', name, messageInput.value)
  }
}

// Key Up Listener
document.onkeyup = function(){
  // Looks to see if the user is typing and emits that to the server
  if(nameForm.style.display == 'none' && messageInput.value != ''){ 
    socket.emit('typing', name, messageInput.value)
  }
}

// On Chat Message Socket Received
socket.on('chat message', function(name, msg) {
  // If there's a typing message for the user, removes it
  if(messages.querySelectorAll('.typing')){
    messages.querySelector(`.${name}`).remove()
  }
  // Create the message element and display it to the dom
  let item = document.createElement('pre')
  item.classList = "message"
  item.textContent = '> ' + name + ': ' + msg
  messages.appendChild(item)
  // If there's any typing messages from other users, push them under the new message
  if(messages.querySelectorAll('.typing')){
    messages.querySelectorAll('.typing').forEach((typingMsg) => {
      messages.appendChild(typingMsg)
    })
  }
  messages.scrollTo(0, messages.scrollHeight)
})

// On Typing Socket Received
socket.on('typing', function(name, msg) {
  // If the user doesn't already have a typing message, creates one and displays it in the DOM
  if(!messages.querySelector(`.typing.${name}`) && msg != ''){
    let item = document.createElement('p')
    item.classList = `typing ${name}`
    item.textContent = `${name} is typing`
    messages.appendChild(item)
    messages.scrollTo(0, messages.scrollHeight)
    // If the user's message field is now empty, removes their typing message form the DOM 
  } else if(messages.querySelector(`.typing.${name}`) && msg == '') {
    messages.querySelector(`.typing.${name}`).remove()
  }
})