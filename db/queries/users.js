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
      `INSERT INTO users (name, ,phone_number, email, password)
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

module.exports = { getUsers, getUserWithEmail, addUser };
