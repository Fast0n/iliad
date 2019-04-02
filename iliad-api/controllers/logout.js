'use strict';

const request = require('request');

const constants = require('../constants');

module.exports = (req, res) => {
  res.set('Content-Type', 'application/json');

  const {
    token,
  } = req.query;

  const data = {
    iliad: {},
  };

  // eslint-disable-next-line security/detect-possible-timing-attacks
  if (token === undefined) {
    res.sendStatus(400);
    return;
  }

  const options = {
    url: `${constants.ILIAD_BASE_URL}?logout=user`,
    method: 'GET',
    headers: {
      cookie: `ACCOUNT_SESSID=${token}`, // cookie di accesso
    },
  };

  request(options, () => {
    try {
      data.iliad[0] = 'true';
      res.send(data);
    } catch (exeption) {
      res.sendStatus(503);
    }
  });
};
