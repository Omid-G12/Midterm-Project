const db = require('../connection');

const getUsers = () => {
  return db.query('SELECT * FROM users;')
    .then(data => {
      return data.rows;
    });
};

const getUserByEmail = (email) => {
  return db.query('SELECT * FROM users Where email = $1;', [email || null])
    .then(data => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

const getUserById = (id) => {
  return db.query('SELECT * FROM users Where id = $1;', [id || null])
    .then(data => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

const getIdFromEmail = (email) => {
  return db.query('SELECT id FROM users Where email = $1;', [email || null])
    .then(data => {
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
      `INSERT INTO order_items (order_id, menu_item_id, user_id, quantity)
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

const orderTotal =  function() {
  return db
    .query(`
      SELECT sum(menu_items.price * ordered_items.quantity) as total
      FROM menu_items
      JOIN ordered_items ON menu_items.id = ordered_items.menu_item_id
      JOIN orders ON ordered_items.order_id = orders.id
      GROUP BY orders.id;`)
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
  return db.query('SELECT * FROM menu_items;')
    .then(data => {
      return data.rows;
    })
};

const getOrderItems = () => {
  return db.query('SELECT * FROM ordered_items;')
    .then(data => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

module.exports = { getUsers, getUserByEmail, getUserById, getIdFromEmail, createUser, addOrderItem, orderTotal, addOrder, getMenuItems, getOrderItems };
