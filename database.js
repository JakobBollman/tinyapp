const bcrypt = require("bcryptjs");

const urlDatabase = {
  'b6UTxQ': {
    longURL: "https://www.tsn.ca",
    userID:  "4bTa9",
  },
  'i3BoGr': {
    longURL: "https://www.google.ca",
    userID:  "4bTa9",
  },
  'b2xVn2':{
    longURL: "http://www.lighthouselabs.ca",
    userID:  "T5h2a",
  },
  '9sm5xK':{
    longURL: "http://www.google.com",
    userID:  "T5h2a",
  }
};
  

const users = {
  '4bTa9': {
    id: "4bTa9",
    email: "user1@example.com",
    password: bcrypt.hashSync('Chopsuey', 10),
  },
  'T5h2a': {
    id: "T5h2a",
    email: "user2@example.com",
    password: bcrypt.hashSync('Brassmonkey', 10),
  },
};

module.exports = {urlDatabase, users};