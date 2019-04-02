/* eslint-disable security/detect-object-injection */

'use strict';

const request = require('request');

const constants = require('../constants');

module.exports = (req, res) => {
  res.type('json'); // set Content-Type response
  const {
    location,
  } = req.query;

  const options = {
    url: constants.ILIAD_STORES,
    json: true,
  };
  request(options, (error, response, body) => {
    if (location) {
      const results = [];
      let index = 0;
      body.forEach((element) => {
        if (location.toLowerCase() === element.localite.toLowerCase() || location === element.cp) {
          results[index] = element;
          index += 1;
        }
      });
      res.send(results);
    } else {
      res.send(body);
    }
  });
};
