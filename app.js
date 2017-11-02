const hostname = '127.0.0.1'
const PORT = 3000;
const DATABASE = `mongodb://${hostname}/url-shortener`;
const express = require('express');
const app = express();
const mongoose = require('mongoose');


// connection using mongoose to mongodb database
mongoose.connect(DATABASE,
{ useMongoClient: true });
const db = mongoose.connection;
db.on("open", function(ref) {
  console.log("Connected to mongodb server.");
});
db.on("error", function(err) {
  console.log("Could not connect to mongo server!");
});

// set template engine to pug
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');


// use main routes
const mainRouter = require('./routes');
app.use(mainRouter);

// error to page not found
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// render to error template
app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status);
  res.render('error');
});

// set express node.js to listen at (hostname) and (port)
app.listen(PORT, () => {
  console.log(`The application is running on ${hostname}:${PORT}...`);
});
