/* eslint-disable security/detect-object-injection */

'use strict';

const request = require('request');
const cheerio = require('cheerio');

const constants = require('../constants');

module.exports = (req, res) => {
  res.set('Content-Type', 'application/json');

  const {
    estero,
    details,
    credit,
    token,
  } = req.query;

  const data = {
    iliad: {},
  };

  const headers = {
    cookie: `ACCOUNT_SESSID=${token}`, // cookie di accesso
  };

  if (credit !== undefined || (estero !== undefined && token !== undefined)) {
    const options = {
      url: `${constants.authorityILIAD_BASE_URL}${constants.ILIAD_OPTION_URL.credit}`,
      method: 'GET',
      headers,
    };
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        try {
          const x = (credit !== undefined) ? 0 : 4;

          let array2 = [];
          let array3 = [];

          const $ = cheerio.load(body);
          const results = $('body');
          results.each((i, result) => {
            $(result)
              .find('div.conso__content')
              .each((index, element) => {
                array2 = array2.concat([$(element).find('div.conso__text').text().replace(/^\s+|\s+$/gm, '')]);
              });
            $(result)
              .find('div.conso__icon')
              .each((index, element) => {
                const [, , test] = $(element).find('div.wrapper-align').text().replace(/^\s+|\s+$/gm, '')
                  .split('\n');

                if (test !== undefined) {
                  array3 = test;
                } else {
                  array3 = array3.concat([$(element).find('div.wrapper-align').text().replace(/^\s+|\s+$/gm, '')]);
                }
              });
            const title = $(result).find('h2').find('b.red').text()
              .replace(/^\s+|\s+$/gm, '');
            // let title2 = '';
            // $(result).find('div.table-montant').find('div.label').each((index, element) => {
            //   if (index === 1) {
            //     title2 = $(element).text().replace(/^\s+|\s+$/gm, '');
            //   }
            // });

            const title3 = $(result).find('div.end_offerta').text().replace(/^\s+|\s+$/gm, '')
              .match(/\d{2}\/\d{2}\/\d{4}/);

            // var date1 = new Date("08/09/2017");
            // var date2 = new Date("08/10/2017");
            // var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 30));
            // console.log(diffDays)

            data.iliad[0] = {};

            data.iliad[0][0] = `${title}'&\n${title3}`; // titole credito
            data.iliad[0][1] = 'true'; // ricarica button
            data.iliad[0][2] = 'true'; // info consumi button

            const icon = [
              'http://android12.altervista.org/res/ic_call.png',
              'http://android12.altervista.org/res/ic_sms.png',
              'http://android12.altervista.org/res/ic_gb.png',
              'http://android12.altervista.org/res/ic_mms.png',
            ];

            for (let y = 1; y < 5; y += 1) {
              const z = y - 1;
              data.iliad[y] = {};
              const [type, consumption] = array2[x + z].split('\n');
              data.iliad[y][0] = type;
              data.iliad[y][1] = consumption;
              data.iliad[y][2] = array3[x + z]; // titole
              data.iliad[y][3] = icon[y - 1]; // icon
            }

            res.send(data);
          });
        } catch (exeption) {
          res.sendStatus(503);
        }
      }
    });
  } else if (details === 'true' && token !== undefined) {
    const options = {
      umethod: 'GET',
      url: `${constants.ILIAD_BASE_URL}${constants.ILIAD_OPTION_URL.credit}`,
      qs: {
        details: '',
      },
      headers: {
        'Cache-Control': 'no-cache',
        'x-requested-with': 'XMLHttpRequest',
        referer: `${constants.ILIAD_BASE_URL}${constants.ILIAD_OPTION_URL.credit}`,
        cookie: `ACCOUNT_SESSID=${token}`,
        'accept-language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7,pt;q=0.6',
        accept: 'application/json, text/javascript,; q=0.01',
        scheme: 'https',
        method: 'GET',
        authority: 'www.iliad.it',
      },
      json: true,
    };
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        try {
          const $ = cheerio.load(body);

          const type = ['div.voix.preheader', 'div.renvoi-dappel.preheader', 'div.sms.preheader', 'div.data.preheader'];

          let table = [];

          data.iliad.title = [];

          $('div.table-details')
            .each((index, element) => {
              table = table.concat([$(element).find('div.body').text()]);
            });
          data.iliad.title = {};
          const titleText = [
            'Dettaglio dei tuoi consumi voce',
            'Dettaglio del tuo inoltro chiamate',
            'Dettaglio dei tuoi consumi sms',
            'Dettaglio dei tuoi consumi data',
          ];

          for (let x = 0; x < type.length; x += 1) {
            if ($('div.table-details').find(type[x]) !== '') {
              $('div.table-details').find(type[x]).each(() => {
                data.iliad.title[x] = $('div.table-details').find(type[x]).text().replace(/^\s+|\s+$/gm, '');
              });
            } else {
              data.iliad.title[x] = titleText[x];
            }
            if (table[x] !== undefined) {
              data[x] = table[x].replace(/^\s+|\s+$/gm, '').split('\n');
            } else {
              data[x] = undefined;
            }
          }

          if ($('div.no-conso').attr('style') === 'display:none;') {
            for (let z = 0; z < 4; z += 1) {
              data.iliad[z] = {};
              let add = 0;
              if (data[z] !== '') {
                const i = 9;
                for (let x = 0; x < data[z].length / i; x += 1) {
                  data.iliad[z][x] = {};
                  for (let y = 0; y < i; y += 1) {
                    if (y === 6) {
                      data.iliad[z][x][y - 1] = `${data[z][y + add]}: ${data[z][y + add + 1]}`;
                    } else if (y === 1) {
                      data.iliad[z][x][y] = `${data[z][y + add]} ${data[z][y + add + 1]}`;
                    } else if (y === 2) {
                      // none
                    } else if (y === 3) {
                      data.iliad[z][x][y - 1] = data[z][y + add];
                    } else if (y === 7) {
                      // none
                    } else if (y === 8) {
                      data.iliad[z][x][y - 2] = data[z][y + add];
                    } else if (y === 0) {
                      data.iliad[z][x][y] = data[z][y + add];
                    } else {
                      data.iliad[z][x][y - 1] = data[z][y + add];
                    }
                  }
                  add += +i;
                }
              } else {
                data.iliad[z] = {};
                data.iliad[z][0] = '';
              }
            }
          } else {
            data.iliad[0] = $('div.no-conso').text();
          }
          // console.log(data[2].length / 9)
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
