const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080; // default port 8080
let loggedIn = false;

const bcrypt = require("bcryptjs");
// const password = "purple-monkey-dinosaur"; // found in the req.body object
// const hashedPassword = bcrypt.hashSync(password, 10);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

const generateRandomString = function() {
  let newID = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for ( var i = 0; i < 6; i++ ) {
    newID += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return newID;
}
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.post("/urls", (req, res) => {
  if(loggedIn){
    let newId = generateRandomString();
    urlDatabase[newId] = req.body["longURL"];
    res.redirect(`/urls/${newId}`);
  } else {
    const templateVars = {username: req.cookies["username"], userid: req.cookies["userid"], urls: urlDatabase, loggedIn: loggedIn };
    res.render("urls_new", templateVars);
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.clearCookie('userid');
  loggedIn = false;
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const templateVars = {username: req.cookies["username"], userid: req.cookies["userid"], urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = {username: req.cookies["username"], userid: req.cookies["userid"], urls: urlDatabase };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  for(let item in users){
    if(req.body["email"] === users[item]['email']){
      if(bcrypt.compareSync(req.body['password'], users[item]['password'])){
        res.cookie("userid",users[item]['id']);
        res.cookie("username",users[item]);
        loggedIn = true;
        res.redirect("/urls");
      } else {
        res.sendStatus(403);
      }
    }
  }
  res.sendStatus(403);
});

app.get("/register", (req, res) => {
  const templateVars = {username: req.cookies["username"], userid: req.cookies["userid"], urls: urlDatabase };
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  let copy = false;
  for(let item in users){
    if(req.body["email"] === users[item]['email']){
      copy = true;
    }
  }
  if((req.body["email"].length < 1) || (req.body["password"].length < 1)){
    res.sendStatus(400);
  } else if(copy){
    res.sendStatus(400);
  } else {
  let genId = generateRandomString();
  users[genId] = {};
  users[genId]['id'] = genId;
  
  users[genId]['email'] = req.body["email"];
  users[genId]['password'] = bcrypt.hashSync(req.body['password'], 10);

  res.cookie("userid",users[genId]['id']);
  res.cookie("username",users[genId]);
  loggedIn = true;
  res.redirect("/urls");
  }
});

app.get("/urls/new", (req, res) => {
  if(loggedIn){
    const templateVars = {username: req.cookies["username"], userid: req.cookies["userid"], urls: urlDatabase, loggedIn: loggedIn };
    res.render("urls_new",templateVars);
  } else {
    const templateVars = {username: req.cookies["username"], userid: req.cookies["userid"], urls: urlDatabase };
    res.render("urls_login", templateVars);
  }
});

app.get("/urls/:id", (req, res) => {
  if(req.cookies['userid'] === urlDatabase[req.params.id]['userID']){
    const templateVars = {username: req.cookies["username"], userid: req.cookies["userid"], id: req.params.id, longURL: urlDatabase[req.params.id]['longURL'] };
    res.render("urls_show", templateVars);
  } else {
    res.sendStatus(403);
  }
});

app.post("/urls/:id/delete", (req, res) => {
  if(req.cookies['userid'] === urlDatabase[req.params.id]['userID']){
    const templateVars = {username: req.cookies["username"], userid: req.cookies["userid"], id: req.params.id, longURL: urlDatabase[req.params.id]['longURL'] };
    delete urlDatabase[templateVars.id];
    res.redirect('/urls')
  } else {
    res.sendStatus(403);
  }
});

app.post("/urls/:id/edit", (req, res) => {
  if(req.cookies['userid'] === urlDatabase[req.params.id]['userID']){
    const templateVars = {username: req.cookies["username"], userid: req.cookies["userid"], id: req.params.id, longURL: urlDatabase[req.params.id]['longURL'] };
    urlDatabase[templateVars.id]['longURL'] = req.body["newLong"];
    res.redirect(`/urls/${templateVars.id}`);
  } else {
    res.sendStatus(403);
  }
});

app.get("/u/:id", (req, res) => {
  if(urlDatabase.hasOwnProperty(req.params.id)){
    longURL = urlDatabase[req.params.id]['longURL'];
    res.redirect(longURL);
  } else {
    res.sendStatus(404);
  }
});

