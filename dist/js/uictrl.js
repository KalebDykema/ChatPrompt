// DOM Objects
export let nameForm = document.getElementById('enter-name')
export let nameInput = document.getElementById('input-name')
export let messages = document.getElementById('chat-history')
export let messageForm = document.getElementById('send-message')
export let messageInput = document.getElementById('input-message')

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
export function addNewMessage(element, classes, text){
  let item = document.createElement(element)
  item.classList = classes
  item.textContent = text
  messages.appendChild(item)
  appendTypingMessages()
  messages.scrollTo(0, messages.scrollHeight)
}