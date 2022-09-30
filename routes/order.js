const database = require("../db/queries/database");
const express = require('express');
const router  = express.Router();
let q = 4;

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
  //console.log('test', req.body.items);
  const items = req.body.items;
  console.log("req.body", req.body);

  for (let item of items) {
    console.log(item);
    database.getMenuItemsById(item.id)
    .then (data => {
      //console.log(data);
      const orderItem = {
        order_id: q,
        menu_item_id: data.id,
        user_id: req.session.userId,
        quantity: item.quantity
      }
      console.log(orderItem);
      database.addOrderItem(orderItem)
      .then (data => {
        console.log('added to order_items');
        res.redirect("/checkout/:q");
      })
    })
  }
  //addOrderItem(req.body)
  q += 1;
})
module.exports = router;
