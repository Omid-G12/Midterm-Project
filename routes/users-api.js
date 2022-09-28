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

  const users = getUsers();

  res.render("login", users);
});

router.get("/register", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/menu");
  }

  const users = getUsers();

  res.render("register", users);
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
    .catch(e => res.send('Error'));
});

router.get("/", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/menu");
  }
    res.redirect("/login");
});

router.get("/menu", (req, res) => {
  const menu = getMenuItems();

  if (req.session.user_id) {
    return res.render("menu", menu);
  }

    res.redirect("/login");
});

router.get("/checkout/:id", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }

  // const orderItems = getOrderItems();

  res.render("checkout");
});

router.get("/confirmation/:id", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }

  res.render("confirmation", orderTotal());
});

router.post("/register", (req, res) => {
  const {name, phone_number, email, password} = req.body;

  if (!name || !phone_number || !email|| !password) {
    return res.status(400).send("Error: input fields cannot be empty.");
  }

  if (getUserByEmail(email) !== null) {
    return res.send({error: "email already exists"});
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const user = {name, phone_number, email, password: hashedPassword};


  createUser(user)
    .then(user => {
      req.session.userId = user.id;
      res.redirect("/menu");
    })
    .catch(e => res.send("Error")); //dont send error info, just a message


});

module.exports = router;
