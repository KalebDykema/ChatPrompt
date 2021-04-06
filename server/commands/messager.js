// Message
function whisper(recipientAndMessage) {
  let recipient = recipientAndMessage.substring(0, recipientAndMessage.indexOf(' '))
  let message = recipientAndMessage.substring(recipientAndMessage.indexOf(' ')+1)

  // If the message has no recipient, just sends back the message and reply instead of whisper
  if(!recipient) return ['reply', message]
  else return ['whisper', recipient, message]
}

module.exports.whisper = whisper