// Roll Dice
function rollDice(rollCmd){
  const roll = rollCmd
  let numberOfDice
  let die
  let result = 0
  let rolls = []
  let rollsString = ''
  
  // Roll must not be one length, must include d, and must have something after the d
  if(roll.toString().length > 1 && roll.includes('d') && roll.substring(roll.indexOf('d')+1)){
    // If it starts with d, just rolls one die
    if((roll.charAt(0) == 'd' || roll.substring(0, roll.indexOf('d')) == '1')){
      die = parseInt(roll.substring(roll.indexOf('d')+1))
      result = Math.round(Math.random() * (die - 1) + 1)
      return `rolling 1d${die} (${result})`
      // If it starts with a number and has a d after it, rolls that many die
    } else if(parseInt(roll.charAt(0))){
      numberOfDice = parseInt(roll.substring(0, roll.indexOf('d')))
      die = parseInt(roll.substring(roll.indexOf('d')+1))
      for (i = 0; i < numberOfDice; i++) {
        rolls[i] = Math.round(Math.random() * (die - 1) + 1)
        if(i == numberOfDice - 1) rollsString = rollsString.concat(`${rolls[i]}`)
        else rollsString = rollsString.concat(`${rolls[i]} + `)
        result += rolls[i]
      }
      return `rolling ${numberOfDice}d${die} (${result} = ${rollsString})`
    }
  }

  // If there's no roll command or an improper one
  return ['client', 'Must include number of dice and/or type of dice, such as 2d6 or d20']
}

module.exports.rollDice = rollDice;