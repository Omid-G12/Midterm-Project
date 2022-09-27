/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/database');

router.get("/login", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/menu");
  }

  res.render("login", database);
});

router.get("/register", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/menu");
  }

  res.render("register", database);
});

const login =  function(email, password) {
  return database.getUserByEmail(email)
  .then(user => {
    if (bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  });
}

router.post("/login", (req, res) => {
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

router.get("/", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/menu");
  }
  else {
    res.redirect("/login");
  }
});

router.get("/menu", (req, res) => {
  if (req.session.user_id) {
    return res.render("menu", database);
  }
  else {
    res.redirect("/login");
  }
});

router.get("/order/id", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  }

  res.render("checkout", database);
});

router.post("/register", (req, res) => {
  const {name, phone_number, email, password} = req.body;
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const user = {name, phone_number, email, password: hashedPassword};
  if (!name || !phone_number || !email|| !password) {
    return res.status(400).send("Error: input fields cannot be empty.");
  }

  createUser(user)
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
