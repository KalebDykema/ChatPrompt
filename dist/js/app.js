let socket = io()

let name = 'NA'

let nameForm = document.getElementById('enter-name')
let nameInput = document.getElementById('input-name')
let messages = document.getElementById('chat-history')
let messageForm = document.getElementById('send-message')
let messageInput = document.getElementById('input-message')

document.onkeydown = function(e){
  if(e.key == 'Enter' && nameInput.value){
    e.preventDefault()
    name = nameInput.value
    nameInput.value = ''

    nameForm.style.display = 'none'
    messages.style.display = 'block'
    messageForm.style.display = 'flex'
  } else if(e.key == 'Enter' && messageInput.value){
    e.preventDefault()
    socket.emit('chat message', name, messageInput.value,)
    messageInput.value = '';
  } else if(messageInput.value) socket.emit('typing')
}

socket.on('chat message', function(name, msg) {
  if(messages.lastChild.classList == 'typing'){
    messages.lastChild.remove()
  }
  let item = document.createElement('p')
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
  }
})