// DOM Objects
export let nameForm = document.getElementById('enter-name')
export let nameInput = document.getElementById('input-name')
export let messages = document.getElementById('chat-history')
export let messageForm = document.getElementById('send-message')
export let messageInput = document.getElementById('input-message')

// If there's any typing messages from other users, push them under the new user message
function appendTypingMessages(){
  if(messages.querySelectorAll('.typing')){
    messages.querySelectorAll('.typing').forEach((typingMsg) => {
      messages.appendChild(typingMsg)
    })
  }
}

// Adds new message to chat log
export function addNewMessage(element, classes, text){
  let item = document.createElement(element)
  item.classList = classes
  item.textContent = text
  messages.appendChild(item)
  appendTypingMessages()
  messages.scrollTo(0, messages.scrollHeight)
}

// Adds new element to chat log
export function addNewElement(element){
  messages.appendChild(element)
  appendTypingMessages()
  messages.scrollTo(0, messages.scrollHeight)
}

// Checks if there's a typing message and remove it
export function checkForAndRemoveTypingMessage(){
  if(messages.querySelectorAll('.typing') == true){
    messages.querySelector(`.${name}`).remove()
  }
}