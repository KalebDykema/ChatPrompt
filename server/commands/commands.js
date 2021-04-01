/* Command Ideas
  /changename - change name
  /uicolor - change uicolor on client
  /color - change color of your messages on server
  /type - where all message strings will be displayed sequentially, think an iterating for loop that prints the next character and then waits for 100 ms or something; each character prints one at a time
  Lennyface pops up when a 1 is rolled on the roller
  /whisper or /w - private message someone
  /whosonline - shows everyone online
*/
const diceRoller = require('./diceroller.js')
const messager = require('./messager.js')

function runCommand(cmd){
  // Splits the command up into the first word and then after the first space
  cmd = cmd.substring(cmd.indexOf('/')+1)
  let isCommand
  const initCmd = cmd.split(' ')[0].toLowerCase()
  const secondCmd = cmd.substring(cmd.indexOf(' ')+1)

  // Loop through the commands and make sure it's a valid command
  Object.keys(cmds).forEach(key => {
    if(initCmd == key){
      isCommand = true
    }
  })

  if(isCommand) return cmds[initCmd](secondCmd)
  else return ['client ', 'command does not exist']
}

// Commands
const cmds = {
  'whisper': (recipientAndMessage) => messager.whisper(recipientAndMessage),
  'w': (recipientAndMessage) => messager.whisper(recipientAndMessage),
  'roll': (rollCmd) => diceRoller.rollDice(rollCmd.toLowerCase()),
  'r': (rollCmd) => diceRoller.rollDice(rollCmd.toLowerCase()),
  'lennyface': () => '( ͡° ͜ʖ ͡°)',
  'tableflip': () => '(╯°□°）╯︵ ┻━┻',
  'unfliptable': () => '┬─┬ ノ( ゜-゜ノ)'
}

module.exports.runCommand = runCommand