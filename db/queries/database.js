const db = require('../connection');

const getUsers = () => {
  return db.query('SELECT * FROM users;')
    .then((data) => {
      return data.rows;
    });
};

const getUserByEmail = (email) => {
  return db.query('SELECT * FROM users Where email = $1;', [email || null])
    .then((data) => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

const getUserById = (id) => {
  return db.query('SELECT * FROM users Where id = $1;', [id || null])
    .then((data) => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

const getIdFromEmail = (email) => {
  return db.query('SELECT id FROM users Where email = $1;', [email || null])
    .then((data) => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

const createUser =  function(user) {
  return db
    .query(
      `INSERT INTO users (name, phone_number, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING *;`,
      [user.name, user.phone_number, user.email, user.password])
    .then((result) => {
      console.log(result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

const addOrderItem =  function(order_item) {
  return db
    .query(
      `INSERT INTO ordered_items (order_id, menu_item_id, user_id, quantity)
      VALUES ($1, $2, $3, $4)
      RETURNING *;`,
      [order_item.order_id, order_item.menu_item_id, order_item.user_id, order_item.quantity])
    .then((result) => {
      console.log(result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

const orderTotal =  function(order_id) {
  return db
    .query(`
      SELECT sum(menu_items.price * ordered_items.quantity) as total
      FROM menu_items
      JOIN ordered_items ON menu_items.id = ordered_items.menu_item_id
      WHERE order_id = ${order_id}
      GROUP BY order_id;`)
    .then((result) => {
      console.log(result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const addOrder =  function(order) {
  return db
    .query(
      `INSERT INTO orders (user_id, total, duration)
      VALUES ($1, $2, $3)
      RETURNING *;`,
      [order.user_id, order.total, order.duration])
    .then((result) => {
      console.log(result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const getMenuItems = () => {
  return db.query(`SELECT * FROM menu_items;`)
    .then((data) => {
      return data.rows;
    })
};

const getMenuItemsById = (id) => {
  return db.query(`SELECT * FROM menu_items WHERE id = ${id};`)
    .then((data) => {
      return data.rows[0];
    })
};

const getOrderItems = (order_id) => {
  return db.query(`SELECT * FROM ordered_items
  WHERE order_id = ${order_id};`)
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

const removeOrderItems = (menu_item_id) => {
  return db.query(`DELETE * FROM ordered_items
  WHERE menu_item_id = ${menu_item_id}
  RETURNING *;`)
    .then((data) => {
      return data.rows;
    });
};

const updateOrderItems = (menu_item_id, quantity) => {
  return db.query(`UPDATE ordered_items
  SET quantity = ${quantity}
  WHERE menu_item_id = ${menu_item_id}
  RETURNING *;`)
    .then((data) => {
      return data.rows;
    });
};

const getCheckout = (order_id) => {
  return db.query(`SELECT menu_items.name as name, menu_items.price as price, ordered_items.quantity as quantity, menu_items.image_url as image, SUM(menu_items.price * ordered_items.quantity) as item_total
  FROM menu_items
  JOIN ordered_items ON menu_items.id = menu_item_id
  WHERE ordered_items.order_id = ${order_id}
  GROUP BY menu_items.name, menu_items.price, ordered_items.quantity, menu_items.image_url, menu_items.id
  ORDER BY menu_items.id;`)
};

module.exports = { getUsers, getUserByEmail, getUserById, getIdFromEmail, createUser, addOrderItem, orderTotal, addOrder, getMenuItems, getMenuItemsById, getOrderItems, removeOrderItems, updateOrderItems, getCheckout };
