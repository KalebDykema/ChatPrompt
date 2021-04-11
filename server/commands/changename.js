function changeName(name){
  if(!name || name.toLowerCase() == 'changename'){
    return ['client', 'You must type in a valid name.']
  } else return ['name-change', name.toString().trim().replace(/ /g, '-')]
}

module.exports.changeName = changeName