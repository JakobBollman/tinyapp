const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080; // default port 8080

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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  '4bTa9': {
    id: "4bTa9",
    email: "user1@example.com",
    password: "Chop-Suey",
  },
  'T5h2a': {
    id: "T5h2a",
    email: "user2@example.com",
    password: "Brass-Monkey",
  },
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 });
 
app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

app.post("/urls", (req, res) => {
  let newId = generateRandomString();
  urlDatabase[newId] = req.body["longURL"];
  res.redirect(`/urls/${newId}`);
});

// app.post("/login", (req, res) => {
//   res.cookie("username",req.body["userName"]);
//   const templateVars = {username: req.cookies["username"], urls: urlDatabase};
//   res.redirect("/urls");
// });

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.clearCookie('userid');
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
      if(req.body['password'] === users[item]['password']){
        res.cookie("userid",users[item]['id']);
        res.cookie("username",users[item]);
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
  users[genId]['password'] = req.body["password"];
  res.cookie("userid",users[genId]['id']);
  res.cookie("username",users[genId]);
  res.redirect("/urls");
  }
});

app.get("/urls/new", (req, res) => {
  const templateVars = {username: req.cookies["username"], userid: req.cookies["userid"], urls: urlDatabase };
  res.render("urls_new",templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {username: req.cookies["username"], userid: req.cookies["userid"], id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id/delete", (req, res) => {
  const templateVars = {username: req.cookies["username"], userid: req.cookies["userid"], id: req.params.id, longURL: urlDatabase[req.params.id] };
  delete urlDatabase[templateVars.id];
  res.redirect('/urls')
});

app.post("/urls/:id/edit", (req, res) => {
  const templateVars = {username: req.cookies["username"], userid: req.cookies["userid"], id: req.params.id, longURL: urlDatabase[req.params.id] };
  urlDatabase[templateVars.id] = req.body["newLong"];
  res.redirect(`/urls/${templateVars.id}`);
});

app.get("/u/:id", (req, res) => {
  longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

