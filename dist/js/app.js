let socket = io()

let messages = document.getElementById('chat-history')
let form = document.getElementById('send-message')
let input = document.getElementById('input-message')

document.onkeydown = function(e){
  if(e.keyCode == 13 && input.value){
    e.preventDefault()
    socket.emit('chat message', input.value)
    input.value = '';
  } else if(input.value) socket.emit('typing')
}

socket.on('chat message', function(msg) {
  if(messages.lastChild.classList == 'typing'){
    messages.lastChild.remove()
  }
  let item = document.createElement('p')
  item.classList = "message"
  item.textContent = '> ' + msg
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