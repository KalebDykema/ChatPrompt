let socket = io()

let name = 'N/A'

let nameForm = document.getElementById('enter-name')
let nameInput = document.getElementById('input-name')
let messages = document.getElementById('chat-history')
let messageForm = document.getElementById('send-message')
let messageInput = document.getElementById('input-message')

document.onkeydown = function(e){
  if(e.key == 'Enter' && nameInput.value.trim() != ''){
    e.preventDefault()
    name = nameInput.value.trim()
    nameInput.value = ''

    nameForm.style.display = 'none'
    messages.style.display = 'block'
    messageForm.style.display = 'flex'
  } else if(e.key == 'Enter' && messageInput.value.trim() != ''){
    e.preventDefault()
    socket.emit('chat message', name, messageInput.value.trim())
    messageInput.value = '';
  }
  
  if(messageInput.value) socket.emit('typing')
}

document.onkeyup = function(){
  if(messageInput.value) socket.emit('typing')
}

socket.on('chat message', function(name, msg) {
  if(messages.lastChild.classList == 'typing'){
    messages.lastChild.remove()
  }
  let item = document.createElement('pre')
  item.classList = "message"
  item.textContent = '> ' + name + ': ' + msg
  messages.appendChild(item)
  messages.scrollTo(0, messages.scrollHeight)
})

socket.on('typing', function() {
  if(messages.lastChild.classList != 'typing'){
    let item = document.createElement('p')
    item.classList = "typing"
    item.textContent = 'someone is typing'
    messages.appendChild(item)
    messages.scrollTo(0, messages.scrollHeight)
  } else if(messageInput.value == ''){
    messages.lastChild.remove()
  }
})