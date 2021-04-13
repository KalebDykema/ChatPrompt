// whosOnline Function
function whosOnline(secondCmd, users){
  let usersToReturn
  if(users.length == 1) usersToReturn = `${users.length} user online: `
  else usersToReturn = `${users.length} users online: `
  
  users.forEach(user => {
    usersToReturn += `${user}, `
  });
  usersToReturn = usersToReturn.substring(0, usersToReturn.length -2 )
  return ['client', usersToReturn]
}

module.exports.whosOnline = whosOnline