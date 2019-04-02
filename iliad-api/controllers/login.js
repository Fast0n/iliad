'use strict';

const request = require('request');
const cheerio = require('cheerio');

const constants = require('../constants');

module.exports = (req, res) => {
  res.set('Content-Type', 'application/json');

  const {
    userid,
    password,
    token,
  } = req.query;

  const data = {
    iliad: {},
  };

  const headers = {
    cookie: `ACCOUNT_SESSID=${token}`, // cookie di accesso
  };

  if (userid !== undefined && password !== undefined && token !== undefined) {
    const formData = {
      'login-ident': userid,
      'login-pwd': Buffer.from(`${password}`, 'base64').toString('utf8'),
    };

    const options = {
      url: constants.ILIAD_BASE_URL + constants.ILIAD_OPTION_URL.login,
      method: 'POST',
      headers,
      formData,
    };

    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(body);
        const results = body;
        try {
          results.each((i, result) => {
            const nav = $(result).find('div.current-user').first().text()
              .split('\n');
            const check = $(result).find('div.step__text').find('p.green').text();

            data.iliad = {
              version: constants.CURRENT_APP_VERSION,
              user_name: nav[1].replace(/^\s+|\s+$/gm, ''),
              user_id: nav[2].replace(/^\s+|\s+$/gm, ''),
              user_numtell: nav[3].replace(/^\s+|\s+$/gm, ''),
              sim: (check === 'SIM attivata'),
            };
            res.send(data);
          });
        } catch (exeption) {
          res.sendStatus(503);
        }
      }
    });
  } else {
    res.sendStatus(400);
  }
};
