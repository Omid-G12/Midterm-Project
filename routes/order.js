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
  console.log('1111111111111');
  console.log("req.body", req.body);
  const items = [];
  for (let i in req.body) {
    const object = {"id": parseInt(i), "quantity": parseInt(req.body[i])};
    items.push(object);
  }
  console.log("items", items);
  console.log("req.body", req.body);
  const q = Math.floor(Math.random() * 1000);
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
        console.log("1111", orderItem);
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
      console.log("end");
      return res.redirect(`/checkout/${q}`);
    })
  } else {
    q += 1;
  }

  //addOrderItem(req.body)
  //q += 1;
})
module.exports = router;
