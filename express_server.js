//Requires and other dependencies
const { generateRandomString } = require('./helpers.js');
const { urlDatabase, users } = require('./database.js');

const express = require("express");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");

const app = express();
const PORT = 8080; // default port 8080
let loggedIn = false;

const bcrypt = require("bcryptjs");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Setup for cookies
app.use(cookieSession({
  name: 'session',
  keys: ['userid','username']
}));

//Redirects the user from the basic http://localhost:8080/
app.get("/", (req, res) => {
  res.redirect("/login");
});

//Creates a new TinyURL for the newly input longURL
app.post("/urls", (req, res) => {
  if (loggedIn) {
    let newId = generateRandomString();
    urlDatabase[newId] = {
      'longURL': req.body["longURL"],
      'userID': req.session.userid
    };
    res.redirect(`/urls/${newId}`);
  } else {
    const templateVars = {username: req.session.username, userid: req.session.userid, urls: urlDatabase, loggedIn: loggedIn };
    res.render("urls_new", templateVars);
  }
});

//Logs the user out
app.post("/logout", (req, res) => {
  delete req.session.userid;
  delete req.session.username;
  loggedIn = false;
  res.redirect("/urls");
});

//Get Main Page 
app.get("/urls", (req, res) => {
  if(loggedIn){
    const templateVars = {username: req.session.username, userid: req.session.userid, urls: urlDatabase };
    res.render("urls_index", templateVars);
  } else {
    res.sendStatus(403);
  }
  
});

//Get login page
app.get("/login", (req, res) => {
  const templateVars = {username: req.session.username, userid: req.session.userid, urls: urlDatabase };
  res.render("urls_login", templateVars);
});

//Logs the user into the page then redirects back to the main page
app.post("/login", (req, res) => {
  for (let item in users) {
    if (req.body["email"] === users[item]['email']) {
      if (bcrypt.compareSync(req.body['password'], users[item]['password'])) {
        req.session.userid = users[item]['id'];
        req.session.username = users[item];
        loggedIn = true;
        res.redirect("/urls");
      } else {
        res.sendStatus(403);
      }
    }
  }
  //If nothing else works call a 403 error
  if(!loggedIn){
    res.sendStatus(403);
  }
});

//Gets the register page
app.get("/register", (req, res) => {
  const templateVars = {username: req.session.username, userid: req.session.userid, urls: urlDatabase };
  res.render("urls_register", templateVars);
});

//Registers the user into the page the redirect back to the main page
app.post("/register", (req, res) => {
  let copy = false;
  for (let item in users) {
    if (req.body["email"] === users[item]['email']) {
      copy = true;
    }
  }
  if ((req.body["email"].length < 1) || (req.body["password"].length < 1)) {
    res.sendStatus(400);
  } else if (copy) {
    res.sendStatus(400);
  } else {
    let genId = generateRandomString();
    users[genId] = {};
    users[genId]['id'] = genId;
  
    users[genId]['email'] = req.body["email"];
    users[genId]['password'] = bcrypt.hashSync(req.body['password'], 10);

    req.session.userid = users[genId]['id'];
    req.session.username = users[genId];
    loggedIn = true;
    res.redirect("/urls");
  }
});

//Get Create new url page
app.get("/urls/new", (req, res) => {
  if (loggedIn) {
    const templateVars = {username: req.session.username, userid: req.session.userid, urls: urlDatabase, loggedIn: loggedIn };
    res.render("urls_new",templateVars);
  } else {
    const templateVars = {username: req.session.username, userid: req.session.userid, urls: urlDatabase };
    res.render("urls_login", templateVars);
  }
});

//Get Newly created URL page
app.get("/urls/:id", (req, res) => {
  if(typeof urlDatabase[req.params.id] === 'undefined'){
    res.sendStatus(404);
  } else {
  if (req.session.userid === urlDatabase[req.params.id]['userID']) {
    const templateVars = {username: req.session.username, userid: req.session.userid, id: req.params.id, longURL: urlDatabase[req.params.id]['longURL'] };
    res.render("urls_show", templateVars);
  } else {
    res.sendStatus(403);
  }
}
});

//Deletes Selected TinyURL then redirect back to main page
app.post("/urls/:id/delete", (req, res) => {
  if (req.session.userid === urlDatabase[req.params.id]['userID']) {
    const templateVars = {username: req.session.username, userid: req.session.userid, id: req.params.id, longURL: urlDatabase[req.params.id]['longURL'] };
    delete urlDatabase[templateVars.id];
    res.redirect('/urls');
  } else {
    res.sendStatus(403);
  }
});

// Redirects to the selected urls info page
app.post("/urls/:id/edit", (req, res) => {
  if (req.session.userid === urlDatabase[req.params.id]['userID']) {
    const templateVars = {username: req.session.username, userid: req.session.userid, id: req.params.id, longURL: urlDatabase[req.params.id]['longURL'] };
    urlDatabase[templateVars.id]['longURL'] = req.body["newLong"];
    res.redirect(`/urls`);
  } else {
    res.sendStatus(403);
  }
});

//Sends user to the LongURL of the selected TinyURL
app.get("/u/:id", (req, res) => {
  if (urlDatabase.hasOwnProperty(req.params.id)) {
    res.redirect(urlDatabase[req.params.id]['longURL']);
  } else {
    res.sendStatus(404);
  }
});

//Tells when the server connects
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

