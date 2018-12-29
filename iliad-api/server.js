/* eslint-disable security/detect-object-injection */

'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const routes = require('./routes');

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

// disable server info
app.disable('x-powered-by');

app.use('/', routes);

// ⚠️ Error Handlers

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err,
    });
  });
}
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {},
  });
});


module.exports = app;
