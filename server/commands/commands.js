/* Command Ideas
  /w noname - reply to whoever whispered to you last
  /changename - change name
  /uicolor - change uicolor on client
  /color - change color of your messages on server
  /type - where all message strings will be displayed sequentially, think an iterating for loop that prints the next character and then waits for 100 ms or something; each character prints one at a time
  Lennyface pops up when a 1 is rolled on the roller
  /whosonline - shows everyone online
*/
const diceRoller = require('./diceroller.js')
const messager = require('./messager.js')

function runCommand(cmd, users, lastMessaged){
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

  if(isCommand) return cmds[initCmd](secondCmd, users, lastMessaged)
  else return ['client', 'command does not exist']
}

// Commands
const cmds = {
  'lennyface': () => '( ͡° ͜ʖ ͡°)',
  'r': (rollCmd) => diceRoller.rollDice(rollCmd.toLowerCase()),
  'roll': (rollCmd) => diceRoller.rollDice(rollCmd.toLowerCase()),
  'tableflip': () => '(╯°□°）╯︵ ┻━┻',
  'unfliptable': () => '┬─┬ ノ( ゜-゜ノ)',
  'w': (recipientAndMessage, users, lastMessaged) => messager.whisper(recipientAndMessage, users, lastMessaged),
  'whisper': (recipientAndMessage, users, lastMessaged) => messager.whisper(recipientAndMessage, users, lastMessaged),
}

module.exports.runCommand = runCommand