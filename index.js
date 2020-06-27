const express = require('express');
const dotenv = require('dotenv').config({ path: './config/config.env' });
const colors = require('colors');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const connectToDB = require('./config/db');
const passport = require('passport');
const path = require('path');

const users = require('./routes/api/users');

connectToDB();

const app = express();

// body parser 
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());


// passport middleware
app.use(passport.initialize());

// passport config
require('./config/passport')(passport);

// routes
app.use('/api/users', users);

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV == "production") {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`We're live in '${process.env.NODE_ENV}' mode on port ${PORT}`.blue.bold));