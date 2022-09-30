/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const database = require('../db/queries/database');
const bcrypt = require('bcrypt');

router.get("/login", (req, res) => {
  if (req.session.userId) {
    return res.redirect("/menu");
  }

  res.render("login");
});


router.get("/register", (req, res) => {
  if (req.session.userId) {
    return res.redirect("/menu");
  }

  res.render("register");
});

const login =  function(email, password) {
  return database.getUserByEmail(email)
  .then((user) => {
    if (bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  });
}

router.post("/login", (req, res) => {
  console.log(req.body);
  const {email, password} = req.body;
  login(email, password)
    .then(user => {
      if (!user) {
        res.send({error: "error user does not exist"});
        return;
      }
      req.session.userId = user.id;
      res.redirect("/menu");
    })
    .catch(e => res.send('Error'));
});

router.get("/", (req, res) => {
  if (req.session.userId) {
    return res.redirect("/menu");
  }
    res.redirect("/login");
});

router.get("/menu", (req, res) => {
  if (req.session.userId) {
    return database.getMenuItems()
    .then (menu => {
      database.getUserById(req.session.userId)
      .then (user => {
        console.log("menu", menu);
        console.log("user", user);
        return res.render("menu", { menu, user });
      })
    })
  }

    res.redirect("/login");
});

//POST request to handle the checkout
//Menu items (ids) needed

router.get("/checkout", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }

return database.getOrderItems(1)
.then (order => {
  database.getUserById(req.session.userId)
    .then (user => {
      const orderedItems = [];
      Promise.all(order.map(ord => {
        return database.getMenuItemsById(ord.menu_item_id)
        .then (menuItem => {
          ord.menuItem = menuItem;
          return menuItem;
        })
      }))
      .then (orderedItems => {
        return res.render("checkout", { order: orderedItems, user });
      })
    })
  })
});

// router.post("/checkout", (req, res) => {
//   res.redirect("/checkout");
//  });

router.get("/confirmation/:id", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  res.render("confirmation", orderTotal());
});

router.post("/register", (req, res) => {
  const {name, phone_number, email, password} = req.body;

  if (!name || !phone_number || !email|| !password) {
    return res.status(400).send("Error: input fields cannot be empty.");
  }

  database.getUserByEmail(email)
  .then(data => {
    if (data !== undefined) {
      return res.send({error: "email already exists"});
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 12);
    const user = {name, phone_number, email, password: hashedPassword};


    database.createUser(user)
      .then(user => {
        req.session.userId = user.id;
        console.log('cookie line 114', req.session);
        res.redirect("/menu");
      })
      .catch(e => res.send("Error")); //dont send error info, just a message
  });





});

module.exports = router;
