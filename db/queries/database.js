const db = require('../connection');

const getUsers = () => {
  return db.query('SELECT * FROM users;')
    .then(data => {
      return data.rows;
    });
};

const getUserWithEmail = (email) => {
  return db.query('SELECT * FROM users Where email = $1;', [email || null])
    .then(data => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const addUser =  function(user) {
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
    });
}

const addOrderItem =  function(order_item) {
  return db
    .query(
      `INSERT INTO order_items (menu_item_id, user_id, quantity)
      VALUES ($1, $2, $3)
      RETURNING *;`,
      [order_item.menu_item_id, order_item.user_id, order_item.quantity])
    .then((result) => {
      console.log(result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
}



module.exports = { getUsers, getUserWithEmail, addUser, addOrderItem };
