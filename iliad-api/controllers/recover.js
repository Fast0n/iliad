'use strict';

const request = require('request');

const constants = require('../constants');

module.exports = (req, res) => {
  res.set('Content-Type', 'application/json');

  const {
    email,
    userid,
    token,
    name,
    surname,
  } = req.query;

  const data = {
    iliad: {},
  };

  const options = {
    url: `${constants.ILIAD_BASE_URL}${constants.ILIAD_OPTION_URL.recover}`,
    method: 'POST',
    formData: {
      login: userid,
      email,
    },
  };

  if (email !== undefined && userid !== undefined && token !== undefined) {
    request(options, (error, response) => {
      try {
        if (!error && response.statusCode === 200) {
          data.iliad[0] = 'true';
          res.send(data);
          // data.iliad[0] = ''; //flash-error
        } else {
          data.iliad[0] = 'true';
          res.send(data);
        }
      } catch (exeption) {
        res.sendStatus(503);
      }
    });
  } else if (email !== undefined && name !== undefined && surname !== undefined && token !== undefined) {
    options.formData = {
      nom: surname,
      prenom: name,
      email,
    };

    request(options, (error, response) => {
      try {
        if (!error && response.statusCode === 200) {
          data.iliad[0] = 'false';
          res.send(data);
        } else {
          data.iliad[0] = 'true';
          res.send(data);
        }
      } catch (exeption) {
        res.sendStatus(503);
      }
    });
  } else {
    res.sendStatus(400);
  }
};
