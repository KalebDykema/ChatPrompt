/* Command Ideas
  /changename - change name
  /uicolor - change uicolor on client
  /color - change color of your messages on server
  /type - where all message strings will be displayed sequentially, think an iterating for loop that prints the next character and then waits for 100 ms or something; each character prints one at a time
*/
const diceRoller = require('./diceRoller.js')

function runCommand(cmd){
  // Splits the command up into the first word and then after the first space
  cmd = cmd.substring(cmd.indexOf('/')+1).toLowerCase()
  let isCommand
  const initCmd = cmd.split(' ')[0]
  const secondCmd = cmd.substring(cmd.indexOf(' ')+1)

  Object.keys(cmds).forEach(key => {
    if(initCmd == key){
      isCommand = true
    }
  })

  if(isCommand) return cmds[initCmd](secondCmd)
  else return 'client ' + 'command does not exist'
}

// Commands
const cmds = {
  'roll': (rollCmd) => diceRoller.rollDice(rollCmd),
  'r': (rollCmd) => diceRoller.rollDice(rollCmd),
  'lennyface': () => '( ͡° ͜ʖ ͡°)',
  'tableflip': () => '(╯°□°）╯︵ ┻━┻',
  'unfliptable': () => '┬─┬ ノ( ゜-゜ノ)'
}

module.exports.runCommand = runCommand