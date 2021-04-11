import * as help from './help.js'
import * as color from './colorcommands.js'

// Checks to make sure this a command for the local machine and not the server
export function checkForAndRunLocalCommand(cmd, ui){
  // If the shorthand / is used for help, just display help and return
  if(cmd == '/'){
    help.showCommands(ui)
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
  'clear': (ui) => {
    while (ui.messages.firstChild) {
      ui.messages.removeChild(ui.messages.firstChild);
    }
  },
  'help': (ui) => help.showCommands(ui),
  'changeuicolor': (ui, secondCmd) => color.changeUIColor(ui, secondCmd),
  'colors': (ui) => color.showHTMLColors(ui)
}