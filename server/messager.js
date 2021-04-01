// Message
function whisper(recipientAndMessage) {
  let recipient = recipientAndMessage.substring(0, recipientAndMessage.indexOf(' '))
  let message = recipientAndMessage.substring(recipientAndMessage.indexOf(' ')+1)
}

whisper('test hello sir')

module.exports.whisper = whisper