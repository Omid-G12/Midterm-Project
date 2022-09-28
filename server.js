// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const cookieSession = require('cookie-session');
const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

app.use(cookieSession({
  name: 'session',
  keys: ['key1'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);


app.use(express.static('public'));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require('./routes/users-api');
const widgetApiRoutes = require('./routes/widgets-api');
//const usersRoutes = require('./routes/users');
//const database = require('./routes/database');
const orderRoutes = require('./routes/order');
const { getMenuItems } = require('./db/queries/database');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/', userApiRoutes);
app.use('/api/widgets', widgetApiRoutes);
// app.use('/users', usersRoutes);
app.use('/api/order', orderRoutes);
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).


// app.get('/', (req, res) => {
//   res.render('index');
// });

// app.get("/menu", (req, res) => {
//   console.log(database.getMenuItems())
//   res.render("menu");
// });

// app.get("/checkout", (req, res) => {
//   res.render("checkout");
// });

// app.get("/confirmation", (req, res) => {
//   res.render("confirmation");
// });

// app.get("/login", (req, res) => {
//   res.render("login");
// });

// app.get("/register", (req, res) => {
//   res.render("register");
// });

// app.get("/menuandcart", (req, res) => {
//   res.render("menuandcart");
// });


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});


