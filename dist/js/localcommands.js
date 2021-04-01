// Checks to make sure this a command for the local machine and not the server
export function checkForAndRunLocalCommand(cmd, ui){
  // If the shorthand / is used for help, just display help and return
  if(cmd == '/'){
    showCommands(ui)
    return true
  }

  // Splits the command up into the first word and then after the first space
  cmd = cmd.substring(cmd.indexOf('/')+1).toLowerCase()
  let isLocalCommand;
  const initCmd = cmd.split(' ')[0]
  const secondCmd = cmd.substring(cmd.indexOf(' ')+1)

  Object.keys(localCmds).forEach(key => {
    if(initCmd == key){
      localCmds[key](ui, secondCmd)
      isLocalCommand = true;
    }
  })

  if(isLocalCommand) return true
  else return false
}

// Local Commands
const localCmds = {
  'help': (ui) => showCommands(ui),
  'clear': (ui) => {
    while (ui.messages.firstChild) {
      ui.messages.removeChild(ui.messages.firstChild);
    }
  }
}

// Command Descriptions that are printed when using the help command
const cmdDescs = {
  'help or /': 'Prints descriptions for all commands. You must know this since you typed it to get here.',
  'clear': 'Clear the message log.',
  'roll or r': 'Roll a number of dice and choose the type of dice. Two examples are 2d6 or d20.',
  'lennyface': 'Prints a lennyface.',
  'tableflip': 'Flip a table.',
  'unfliptable': 'Be nice and turn the table back over.'
}

function showCommands(ui){
  let results = ''
  for (const cmd in cmdDescs) {
    results = results.concat(`${cmd}: ${cmdDescs[cmd]}\n\n`)
  }
  ui.addNewMessage('p', 'client-cmd', results)
}