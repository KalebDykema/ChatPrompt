export function showCommands(ui){
  let results = ''
  for (const cmd in cmdDescs) {
    results = results.concat(`${cmd}: ${cmdDescs[cmd]}\n\n`)
  }
  ui.addNewMessage('p', 'client', results)
}

// Command Descriptions that are printed when using the help command
const cmdDescs = {
  'changename or cn': 'Change your name.',
  'changeuicolor or uicolor': 'Change the color of your UI with a hexcode or valid HTML color name.',
  'clear or clr': 'Clear the message log.',
  'colors': 'Prints all valid HTML color names in their respective color.',
  'help or /': 'Prints descriptions for all commands. You must know this since you typed it to get here.',
  'lennyface': 'Prints a lennyface.',
  'roll or r': 'Roll a number of dice and choose the type of dice. Two examples are 2d6 or d20.',
  'tableflip': 'Flip a table.',
  'unfliptable': 'Be nice and turn the table back over.',
  'whisper or w': 'Send a private message to a user by typing /w name your message. You can reply to a user by simply not typing their name, just type /w your message.',
  'whosonline or online': 'Shows how many users are online and what their names are.'
}
