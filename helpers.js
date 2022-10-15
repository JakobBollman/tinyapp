const getUserByEmail = function(email, database) {
  for(let item in database){
    if(email === database[item]['email']){
      return database[item]['id'];
    }
  }
};

const generateRandomString = function() {
  let newID = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    newID += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return newID;
};

module.exports = { getUserByEmail, generateRandomString };