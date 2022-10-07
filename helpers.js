const getUserByEmail = function(email, database) {
  for(let item in database){
    if(email === database[item]['email']){
      return database[item]['id'];
    }
  }
};

module.exports = { getUserByEmail };