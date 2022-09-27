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

});

module.exports = router;
