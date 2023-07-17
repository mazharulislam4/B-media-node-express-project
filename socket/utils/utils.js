
export function isExist(users , id) {
  return users.some((user) => user.userId === id);
}

// remove disconnected user by filter

export function removeUser(users , id) {
  return users.filter((user) => user.userId !== id);
}

// find a user by id 
export function findAUserById( users  , id){
 return users.find((user)=> user.userId === id)
}

