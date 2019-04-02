'use strict';

const request = require('request');
const cheerio = require('cheerio');

const constants = require('../constants');

module.exports = (req, res) => {
  const {
    cbtype,
    cbnumero,
    montant,
    cbexpmois,
    cbexpannee,
    cbcrypto,
    payinfoprice,
    payinfocard,
    token,
  } = req.query;

  const data = {
    iliad: {},
  };

  const headers = {
    cookie: `ACCOUNT_SESSID=${token}`, // cookie di accesso
  };

  if (montant !== undefined && cbtype !== undefined && cbnumero !== undefined && cbexpmois !== undefined && cbexpannee !== undefined && cbcrypto !== undefined && token !== undefined) {
    // Esecuzione ricarica
    const formData = {
      'cb-type': cbtype,
      'cb-numero': cbnumero,
      'cb-exp-mois': cbexpmois,
      'cb-exp-annee': cbexpannee,
      'cb-crypto': cbcrypto,
    };
    const options = {
      url: `${constants.ILIAD_BASE_URL}${constants.ILIAD_OPTION_URL.recharge}?montant=${montant}`,
      method: 'POST',
      headers,
      formData,
    };
    request(options, (error, response, body) => {
      data.iliad[0] = {};
      if (!error && response.statusCode === 200) {
        try {
          // flash-error
          const $ = cheerio.load(body);
          const results = $('body');
          results.each((i, result) => {
            if ($(result).find('div.flash-error') != null) {
              const [message] = $(result).find('div.flash-error').text().replace(/^\s+|\s+$/gm, '')
                .replace('Le montant de la transaction est incorrect.\n×', 'Informazioni bancarie errate, transazione annullata.')
                .split('\n');
              data.iliad[0] = message;
            } else {
              data.iliad[0] = 'true';
            }
          });
          res.send(data);
        } catch (exeption) {
          res.sendStatus(503);
        }
      }
    });
  } else if (payinfocard === 'true' && token !== undefined) {
    // Informazione per la ricarica
    let card = [];
    let month = [];
    let year = [];
    const options = {
      url: `${constants.ILIAD_BASE_URL}${constants.ILIAD_OPTION_URL.recharge}?montant=5`,
      method: 'GET',
      headers,
    };
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        try {
          const $ = cheerio.load(body);
          const results = $('body');

          results.each((i, result) => {
            $(result)
              .find('div.card-types')
              .find('img.creditCard')
              .each((index, element) => {
                card = card.concat([$(element).attr('data-cc-value')]);
              });
            $(result)
              .find('select.mdc-select__input')
              .each((index, element) => {
                if (index === 0) {
                  $(element).find('option')
                    .each((_, el) => {
                      if ($(el).attr('value') !== '') {
                        month = month.concat([$(el).attr('value')]);
                      }
                    });
                } else if (index === 1) {
                  $(element).find('option')
                    .each((_, el) => {
                      if ($(el).attr('value') !== '') {
                        year = year.concat([$(el).attr('value').replace('20', '')]);
                      }
                    });
                }
              });
          });
          data.iliad[0] = {};
          data.iliad[1] = {};
          data.iliad[0] = card;
          data.iliad[1] = year;

          res.send(data);
        } catch (exeption) {
          res.sendStatus(503);
        }
      }
    });
  } else if (payinfoprice === 'true' && token !== undefined) {
    // Informazione sulle possibilità di importo per la ricarica
    let price = [];
    const options = {
      url: `${constants.ILIAD_BASE_URL}${constants.ILIAD_OPTION_URL.recharge}`,
      method: 'GET',
      headers,
    };

    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        try {
          const $ = cheerio.load(body);
          const results = $('body');
          results.each((i, result) => {
            $(result).find('select.mdc-select__input').find('option')
              .each((index, element) => {
                if ($(element).attr('value') !== '') {
                  price = price.concat([$(element).attr('value')]);
                }
              });
            data.iliad[0] = {};
            data.iliad[0] = price;
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
