// Roll Dice
function rollDice(rollCmd){
  const roll = rollCmd
  let numberOfDice
  let die
  let result = 0
  let rolls = []
  let rollsString = ''
  
  // If it starts with d, just rolls one die
  if(roll.charAt(0) == 'd' || roll.charAt(0) == '1'){
    die = parseInt(roll.substring(roll.indexOf('d')+1))
    result = Math.round(Math.random() * (die - 1) + 1)
    return `rolling 1d${die} (${result})`
    // If it starts with a number and has a d after it, rolls that many die
  } else if(parseInt(roll.charAt(0))){
    numberOfDice = parseInt(roll.charAt(0))
    die = parseInt(roll.substring(roll.indexOf('d')+1))
    for (i = 0; i < numberOfDice; i++) {
      rolls[i] = Math.round(Math.random() * (die - 1) + 1)
      if(i == numberOfDice - 1) rollsString = rollsString.concat(`${rolls[i]}`)
      else rollsString = rollsString.concat(`${rolls[i]} + `)
      result += rolls[i]
    }
    return `rolling ${numberOfDice}d${die} (${result} = ${rollsString})`
    // If there's no roll command
  } else return ['client ', 'must include number of dice and/or type of dice, such as 2d6 or d20']
}

module.exports.rollDice = rollDice;