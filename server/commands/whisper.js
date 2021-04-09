// Message
function whisper(recipientAndMessage, users, lastMessaged) {
  let recipient = recipientAndMessage.substring(0, recipientAndMessage.indexOf(' '))
  let message = recipientAndMessage.substring(recipientAndMessage.indexOf(' ')+1)
  
  // If the message has no recipient, just sends back the message and reply instead of whisper
  if (!users.includes(recipient) && !users.includes(lastMessaged)) return ['client', 'User does not exist']
  else if(!users.includes(recipient)) return ['reply', `${recipient} ${message}`]
  else return ['whisper', recipient, message]
}

module.exports.whisper = whisper