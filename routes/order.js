const database = require("../db/queries/database");
const express = require('express');
const router  = express.Router();
let pastNumbers = [1, 2, 3 ,4 , 5];

router.get ("/", (req, res) => {
  database.getOrderItems()
  .then (data => {
    res.json(data);
  })
});

router.get ("/allmenuitems", (req, res) => {
  database.getMenuItems()
  .then (data => {
    res.json(data);
  })
});

router.post ("/", (req, res) => {
  const items = [];
  for (let i in req.body) {
    const object = {"id": parseInt(i), "quantity": parseInt(req.body[i])};
    items.push(object);
  }
  const q = Math.floor(Math.random() * 100000);
  if (!pastNumbers.includes(q)) {
    Promise.all(items.map(itm => {
      return database.getMenuItemsById(itm.id)
      .then (data => {
        //console.log(data);
        const orderItem = {
          order_id: q,
          menu_item_id: data.id,
          user_id: req.session.userId,
          quantity: itm.quantity
        }
        database.addOrderItem(orderItem)
        // .then (data => {
        //   console.log("data", data);
        //   console.log('added to order_items');
        //
        // })
      })
    }))
    .then (response => {
      pastNumbers.push(q);
      return res.redirect(`/checkout/${q}`);
    })
  } else {
    q += 1;
  }

  //addOrderItem(req.body)
  //q += 1;
})
module.exports = router;
