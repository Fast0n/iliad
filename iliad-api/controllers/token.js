'use strict';

const request = require('request');

const constants = require('../constants');

module.exports = (req, res) => {
  res.set('Content-Type', 'application/json');

  const {
    userid,
    password,
  } = req.query.userid;

  const data = {
    iliad: {},
  };

  if (userid !== undefined && password !== undefined) {
    const formData = {
      'login-ident': userid,
      'login-pwd': Buffer.from(`${password}`, 'base64').toString('utf8'),
    };

    const options = {
      url: constants.ILIAD_BASE_URL + constants.ILIAD_OPTION_URL.login,
      method: 'POST',
      formData,
    };

    request(options, (error, response) => {
      const [, token] = response.headers['set-cookie'][0].split(';')[0].split('=');
      data.iliad[0] = token;
      res.send(data);
    });
  } else {
    res.sendStatus(400);
  }
};
