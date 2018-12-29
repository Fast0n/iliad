/* eslint-disable security/detect-object-injection */

'use strict';

const request = require('request');
const cheerio = require('cheerio');

const constants = require('../constants');

module.exports = (req, res) => {
  res.set('Content-Type', 'application/json');

  const {
    token,
    services,
    // eslint-disable-next-line camelcase
    change_services,
    update,
    activate,
    info,
    type,
  } = req.query;

  const data = {
    iliad: {},
  };

  const headers = {
    cookie: `ACCOUNT_SESSID=${token}`, // cookie di accesso
  };
  if (services === 'true' && token !== undefined) {
    const options = {
      url: `${constants.ILIAD_BASE_URL}${constants.ILIAD_OPTION_URL.services}`,
      method: 'GET',
      headers,
    };
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        try {
          const $ = cheerio.load(body);
          const results = $('body');
          let status = [];
          let text = [];
          let array3 = [];
          let query = [];
          results.each((i, result) => {
            // eslint-disable-next-line camelcase
            const title_option = $(result).find('h1').text().split('\n')[1].replace(/^\s+|\s+$/gm, '');
            // as__status--off
            $(result)
              .find('div.as__status--active')
              .each((index, element) => {
                text = text.concat([$(element).find('span.as__status__text').text()]);
                status = status.concat([$(element).find('i').attr('class')]);
              });
            $(result)
              .find('div.grid-l.as__item')
              .find('div.grid-c.w-2.w-desktop-2.w-tablet-4.as__cell.as__status')
              .each((index, element) => {
                if ($(element).find('a').attr('href') !== undefined) {
                  query = query.concat([$(element).find('a').attr('href').split('=')[1].split('&')[0]]);
                }
              });
            $(result)
              .find('div.bold')
              .each((index, element) => {
                array3 = array3.concat([$(element).find('a').text()]);
              });

            const option = {};

            const num = query.length;

            for (let x = 0; x <= num; x += 1) {
              option[x] = [];
              data.iliad[x] = {};
            }

            for (let x = 0; x < Object.keys(option).length - 1; x += 1) {
              option[x][0] = array3[x + 4].split('\n')[2].replace(/^\s+|\s+$/gm, '');
              option[x][1] = text[x];
              if (status[x] === 'icon i-check') {
                option[x][2] = 'true';
              } else {
                option[x][2] = 'false';
              }
              option[x][3] = query[x];
            }
            // eslint-disable-next-line camelcase
            data.iliad[0][0] = title_option;

            for (let x = 0; x <= num; x += 1) {
              for (let y = 0; y < option[x].length; y += 1) {
                data.iliad[x + 1][y] = option[x][y];
              }
            }
            res.send(data);
          });
        } catch (exeption) {
          res.sendStatus(503);
        }
      }
    });
    // eslint-disable-next-line camelcase
  } else if (change_services === 'true' && activate !== undefined && update !== undefined && token !== undefined) {
    const options = {
      url: `${constants.ILIAD_BASE_URL}${constants.ILIAD_OPTION_URL.services}?update=${update}&activate=${activate}`,
      method: 'GET',
      headers,
    };
    request(options, (error, response) => {
      if (!error && response.statusCode === 200) {
        try {
          data.iliad[0] = 'true';

          res.send(data);
        } catch (exeption) {
          res.sendStatus(503);
        }
      }
    });
  } else if (info === 'true' && type !== undefined && token !== undefined) {
    const options = {
      url: `${constants.ILIAD_BASE_URL}${constants.ILIAD_OPTION_URL.services}/${type}`,
      method: 'GET',
      headers,
    };
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        try {
          const $ = cheerio.load(body);
          const results = $('body');
          results.each((i, result) => {
            const title = $(result).find('div.grid-c.w-desktop-8.as__item__name.as__cell').find('div.inner.bold').text()
              .replace(/^\s+|\s+$/gm, '');
            const infoBody = $(result).find('div.service-description').text().replace(/^\s+|\s+$/gm, '');
            let status = '1';
            if ($(result).find('div.as__status--on').find('a').attr('href') === undefined) {
              status = '0';
            }
            data.iliad[0] = title;
            data.iliad[1] = infoBody;
            data.iliad[2] = status;
          });
          res.send(data);
        } catch (exeption) {
          res.sendStatus(503);
        }
      }
    });
  } else {
    res.sendStatus(400);
  }
};
