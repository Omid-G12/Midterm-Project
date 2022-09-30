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
  const user = null;
  res.render("login", {user});
});


router.get("/register", (req, res) => {
  if (req.session.userId) {
    return res.redirect("/menu");
  }
  const user = null;
  res.render("register", {user});
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

router.post ("/confirmation", (req, res) => {
  const orderId = req.body.order_id;

  return res.redirect(`/confirmation/${orderId}`);

});

router.get("/confirmation/:id", (req, res) => {
  const orderID = req.params.id;
  const order_id = { orderID };

  return database.getUserById(req.session.userId)
  .then (user => {
    database.getCheckout(req.params.id)
    .then (orderInfo => {
      database.orderTotal(req.params.id)
      .then (orderTotal => {
        var sid = "AC4700d14a51ade872f7db39c502a5a475";
        var auth_token = "5b1bbbe4a59ca1a206961419fcf2008f";
        var client = require("twilio")(sid, auth_token);

   console.log("print sid no."+sid);


  client.messages
    .create({
      from: "+19259406874",
      to: "+15879693481",
     // body: " Your order is placed successfully! You will receive an SMS with pickup time. ",
     // body: " Your order is placed and will be ready in 30 mintues",
      body: " Your order will be ready to pickup at 1:00 PM on 30th September 2022",
    })


    .then(function(res) {console.log(" Message is sent " )})
    .catch(function(err)  {
      console.log(err);
    });
        return res.render("confirmation", { order: orderInfo.rows, user, orderTotal, order_id});
      })
    })
  })
});

router.get("/checkout/:id", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  const orderID = req.params.id;
  const order_id = { orderID };

return database.getUserById(req.session.userId)
.then (user => {
  database.getCheckout(req.params.id)
  .then (orderInfo => {
    database.orderTotal(req.params.id)
    .then (orderTotal => {
      return res.render("checkout", { order: orderInfo.rows, user, orderTotal, order_id});
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

  router.post("/logout", (req, res) => {
    const id = req.session.user_id;
    //res.clearCookie('user_id', id);
    req.session = null;
    res.redirect("/login");
  });

module.exports = router;
