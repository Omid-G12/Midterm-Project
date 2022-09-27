/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/users');

app.get("/login", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/menu");
  }

  const userId = req.session.user_id;
  const user = users[userId];

  res.render("login", database);
});

app.get("/register", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/menu");
  }

  const userId = req.session.user_id;
  const user = users[userId];

  res.render("register", database);
});

const login =  function(email, password) {
  return database.getUserWithEmail(email)
  .then(user => {
    if (bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  });
}

app.post("/login", (req, res) => {
  const {email, password} = req.body;
  login(email, password)
    .then(user => {
      if (!user) {
        res.send({error: "error user does not exist"});
        return;
      }
      req.session.userId = user.id;
      res.send({user: {name: user.name, email: user.email, id: user.id}});
    })
    .catch(e => res.send(e));
});

app.post("/register", (req, res) => {
  const {name, phone_number, email, password} = req.body;
  addUser(name, phone_number, email, password)
    .then(user => {
      if (!user) {
        res.send({error: "email already exists"});
        return;
      }
      req.session.userId = user.id;
      res.send({user: {name: user.name, email: user.email, id: user.id}});
    })
    .catch(e => res.send(e));
});

app.get("/", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/menu");
  }
  else {
    res.redirect("/login");
  }
});

app.get("/menu", (req, res) => {
  if (req.session.user_id) {
    return res.render("menu", database);
  }
  else {
    res.redirect("/login");
  }
});

app.get("/order/id", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  }

  res.render("checkout", database);
});

app.post("/register", (req, res) => {
  const {name, phone_number, email, password} = req.body;
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  if (!name || !phone_number || !email|| !password) {
    return res.status(400).send("Error: input fields cannot be empty.");
  }

  createUser(name, phone_number, email, hashedPassword)
    .then(user => {
      if (!user) {
        res.send({error: "email already exists"});
        return;
      }
      req.session.userId = user.id;
      res.send({user: {name: user.name, email: user.email, id: user.id}});
    })
    .catch(e => res.send(e));

  req.session.user_id = database.getIdFromEmail(email);
  res.redirect("/menu");
});

module.exports = router;
