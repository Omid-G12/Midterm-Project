/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();



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
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("Error: email and password fields cannot be empty.");
  }
  if (database.getUserByEmail(req.body.email)) {
    return res.status(400).send("Error: Email already exists.");
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  database.createUser (req.body.name, req.body.phone_number, req.body.email, hashedPassword);

  req.session.user_id = database.getIdFromEmail(req.body.email);
  res.redirect("/menu");
});

module.exports = router;
