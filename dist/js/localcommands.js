// Checks to make sure this a command for the local machine and not the server
export function checkForAndRunLocalCommand(cmd, ui){
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

  if(isLocalCommand == true) return true
  else return false
}

// Local Commands
const localCmds = {
  'clear': (ui) => {
    console.log('clear')
    while (ui.messages.firstChild) {
      ui.messages.removeChild(ui.messages.firstChild);
    }
  }
}