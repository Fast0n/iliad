/* eslint-disable security/detect-object-injection */

'use strict';

const request = require('request');
const cheerio = require('cheerio');

const constants = require('../constants');

module.exports = (req, res) => {
  res.set('Content-Type', 'application/json');

  const {
    doc,
    token,
  } = req.query;

  const data = {
    iliad: {},
  };

  const headers = {
    cookie: `ACCOUNT_SESSID=${token}`, // cookie di accesso
  };

  if (doc === 'true' && token !== undefined) {
    const options = {
      url: `${constants.ILIAD_BASE_URL}${constants.ILIAD_OPTION_URL.document}`,
      method: 'POST',
      headers,
    };
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        try {
          const $ = cheerio.load(body);
          const results = $('body');
          let array = [];
          let array2 = [];
          results.each((i, result) => {
            $(result)
              .find('div.conso__content')
              .each((index, element) => {
                array = array.concat([$(element).find('div.conso__text').text()]);
                array2 = array2.concat([$(element).find('div.conso__text').find('a').attr('href')]);
              });
            for (let x = 0; x < array.length; x += 1) {
              data.iliad[x] = {};
              data.iliad[x][0] = array[x].split('\n')[1].replace(/^\s+|\s+$/gm, ''); // condition title
              data.iliad[x][1] = array[x].split('\n')[2].replace(/^\s+|\s+$/gm, ''); // condition text
              data.iliad[x][2] = `https://www.iliad.it${array2[x]}`; // condition doc
            }
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
