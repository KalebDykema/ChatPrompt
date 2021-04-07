// Message
function whisper(recipientAndMessage, users) {
  let recipient = recipientAndMessage.substring(0, recipientAndMessage.indexOf(' '))
  let message = recipientAndMessage.substring(recipientAndMessage.indexOf(' ')+1)
  console.log(users)

  // If the message has no recipient, just sends back the message and reply instead of whisper
  if(!recipient) return ['reply', message]
  else if (!users.contains(recipient)) return ['client', 'User does not exist']
  else return ['whisper', recipient, message]
}

module.exports.whisper = whisper