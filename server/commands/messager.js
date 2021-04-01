// Message
function whisper(recipientAndMessage) {
  let recipient = recipientAndMessage.substring(0, recipientAndMessage.indexOf(' '))
  let message = recipientAndMessage.substring(recipientAndMessage.indexOf(' ')+1)

  return ['whisper', recipient, message]
}

whisper('test hello sir')

module.exports.whisper = whisper