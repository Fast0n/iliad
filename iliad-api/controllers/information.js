'use strict';

const request = require('request');
const cheerio = require('cheerio');

const constants = require('../constants');

module.exports = (req, res) => {
  res.set('Content-Type', 'application/json');

  const {
    info,
    token,
    puk,
    password,
    // eslint-disable-next-line camelcase
    new_password,
    // eslint-disable-next-line camelcase
    new_password_confirm,
    email,
    // eslint-disable-next-line camelcase
    email_confirm,
    method,
    cbtype,
    cbnumero,
    cbexpmois,
    cbexpannee,
    cbcrypto,
    sepatitulaire,
    sepabic,
    sepaiban,
  } = req.query.info;

  const data = {
    iliad: {},
  };
  const headers = {
    cookie: `ACCOUNT_SESSID=${token}`, // cookie di accesso
  };

  if (info === 'true' && token !== undefined) {
    const options = {
      url: `${constants.ILIAD_BASE_URL}${constants.ILIAD_OPTION_URL.information}`,
      method: 'POST',
      headers,
    };
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        try {
          const $ = cheerio.load(body);
          const results = $('body');
          let array = [];
          results.each((i, result) => {
            $(result)
              .find('div.infos__content')
              .each((index, element) => {
                array = array.concat([$(element).find('div.infos__text').text()]);
              });

            data.iliad[0] = {};
            data.iliad[1] = {};
            data.iliad[2] = {};
            data.iliad[3] = {};
            data.iliad[4] = {};

            data.iliad[0][0] = array[0].split('\n')[1].replace(/^\s+|\s+$/gm, ''); // address title
            data.iliad[0][1] = array[0].split('\n')[3].replace(/^\s+|\s+$/gm, ''); // address
            data.iliad[0][2] = array[0].split('\n')[5].replace(/^\s+|\s+$/gm, ''); // cap
            data.iliad[0][3] = ''; // icon modifica
            data.iliad[0][4] = 'http://android12.altervista.org/res/ic_adress.png'; // icon

            try {
              data.iliad[1][0] = array[1].split('\n')[1].replace(/^\s+|\s+$/gm, ''); // pay title
              data.iliad[1][1] = `${array[1].split('\n')[2].replace(/^\s+|\s+$/gm, '')} | ${array[1].split('\n')[3].replace(/^\s+|\s+$/gm, '')}`; // pay method
              data.iliad[1][2] = array[1].split('\n')[4].replace(/^\s+|\s+$/gm, ''); // pay method card
              // data.iliad[1][3] = "http://android12.altervista.org/res/ic_edit.png"; //icon modifica
              data.iliad[1][3] = ''; // icon modifica
              data.iliad[1][4] = 'http://android12.altervista.org/res/ic_credit_card.png'; // icon
            } catch (exception) {
              data.iliad[1][0] = array[1].split('\n')[1].replace(/^\s+|\s+$/gm, ''); // pay title
              data.iliad[1][1] = array[1].split('\n')[2].replace(/^\s+|\s+$/gm, ''); // pay method
              // data.iliad[1][2] = "http://android12.altervista.org/res/ic_edit.png"; //icon modifica
              data.iliad[1][2] = ''; // icon modifica
              data.iliad[1][3] = 'http://android12.altervista.org/res/ic_credit_card.png'; // icon
            }

            data.iliad[2][0] = array[2].split('\n')[1].replace(/^\s+|\s+$/gm, ''); // mail title
            data.iliad[2][1] = array[2].split('\n')[2].replace(/^\s+|\s+$/gm, ''); // mail
            data.iliad[2][2] = 'http://android12.altervista.org/res/ic_edit.png'; // icon modifica
            data.iliad[2][3] = 'http://android12.altervista.org/res/ic_email.png'; // icon


            data.iliad[3][0] = array[3].split('\n')[1].replace(/^\s+|\s+$/gm, ''); // password title
            data.iliad[3][1] = array[3].split('\n')[2].replace(/^\s+|\s+$/gm, ''); // password
            data.iliad[3][2] = 'http://android12.altervista.org/res/ic_edit.png'; // icon modifica
            data.iliad[3][3] = 'http://android12.altervista.org/res/ic_puk.png'; // icon

            data.iliad[4][0] = array[4].split('\n')[3].replace(/^\s+|\s+$/gm, ''); // puk title
            data.iliad[4][1] = 'xxxxxx';
            data.iliad[4][3] = 'http://android12.altervista.org/res/ic_password.png'; // icon modifica
            data.iliad[4][2] = 'http://android12.altervista.org/res/ic_show.png'; // icon
            res.send(data);
          });
        } catch (exeption) {
          res.sendStatus(503);
        }
      }
    });
  } else if (puk === 'true' && token !== undefined) {
    const options = {
      method: 'GET',
      url: `${constants.ILIAD_BASE_URL}${constants.ILIAD_OPTION_URL.information}`,
      qs: {
        show: 'puk',
      },
      headers: {
        'Cache-Control': 'no-cache',
        'x-requested-with': 'XMLHttpRequest',
        cookie: `ACCOUNT_SESSID=${token}`,
        'accept-language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7,pt;q=0.6',
        accept: 'application/json, text/javascript, */*; q=0.01',
        scheme: 'https',
        method: 'GET',
        authority: 'www.iliad.it',
      },
      json: true,
    };
    request(options, (error, response, body) => {
      try {
        data.iliad[0] = {};
        if (body[0].result.data !== undefined) {
          data.iliad[0] = body[0].result.data.code_puk;
          res.send(data);
        } else {
          data.iliad[0] = 'Codice PUK non disponibile';
          res.send(data);
        }
      } catch (exeption) {
        res.sendStatus(503);
      }
    });
    // richiesta per cambiare la mail
    // eslint-disable-next-line camelcase
  } else if (email !== undefined && email_confirm !== undefined && password !== undefined && token !== undefined) {
    const formData = {
      email,
      'email-confirm': email_confirm,
      password: Buffer.from(`${password}`, 'base64').toString('utf8'),
    };
    const options = {
      url: `${constants.ILIAD_BASE_URL}${constants.ILIAD_OPTION_URL.information}/email`,
      method: 'POST',
      headers,
      formData,
    };
    request(options, (error) => {
      if (!error) {
        try {
          data.iliad[0] = 'true';
          res.send(data);
        } catch (exeption) {
          res.sendStatus(503);
        }
      }
    });
    // eslint-disable-next-line camelcase
  } else if (new_password !== undefined && new_password_confirm !== undefined && password !== undefined && token !== undefined) {
    // Cambio password

    const formData = {
      'password-current': Buffer.from(`${password}`, 'base64').toString('utf8'),
      // eslint-disable-next-line camelcase
      'password-new': Buffer.from(`${new_password}`, 'base64').toString('utf8'),
      // eslint-disable-next-line camelcase
      'password-new-confirm': Buffer.from(`${new_password_confirm}`, 'base64').toString('utf8'),
    };
    const options = {
      url: `${constants.ILIAD_BASE_URL}${constants.ILIAD_OPTION_URL.information}/password`,
      method: 'POST',
      headers,
      formData,
    };
    request(options, (error) => {
      if (!error) {
        try {
          data.iliad[0] = 'true';
          res.send(data);
        } catch (exeption) {
          res.sendStatus(503);
        }
      }
    });
    // site_url + "?phonecharge=true&montant=" + montant.replace("€", "") + "&cbtype=" + typecard + "&cbnumero=" + nCard.getText().toString().replaceAll("\\s+", "") + "&cbexpmois=" + nExpiration.getText().toString().split("/")[0] + "&cbexpannee=20" + nExpiration.getText().toString().split("/")[1] + "&cbcrypto=" + ncvv.getText().toString() + "&token=" + token
  } else if (password !== undefined && method !== undefined && token !== undefined) {
    let formData = {};
    if (method === 'aucun') {
      formData = {
        'mode-paiement': method,
        password: Buffer.from(`${password}`, 'base64').toString('utf8'),
      };
    } else if (method === 'cb') {
      formData = {
        'mode-paiement': method,
        'cb-type': cbtype,
        'cb-numero': cbnumero,
        'cb-exp-mois': cbexpmois,
        'cb-exp-annee': cbexpannee,
        'cb-crypto': cbcrypto,
        password: Buffer.from(`${password}`, 'base64').toString('utf8'),
      };
    } else if (method === 'seba') {
      formData = {
        'mode-paiement': method,
        'sepa-titulaire': sepatitulaire,
        'sepa-bic': sepabic,
        'sepa-iban': sepaiban,
        password: Buffer.from(`${password}`, 'base64').toString('utf8'),
      };
    }
    const options = {
      url: `${constants.ILIAD_BASE_URL}${constants.ILIAD_OPTION_URL.information}/paiement`,
      method: 'POST',
      headers,
      formData,
    };
    request(options, (error, response, body) => {
      if (!error) {
        try {
          const $ = cheerio.load(body);
          const results = $('body');
          results.each((i, result) => {
            const errors = $(result).find('div.flash.flash-error').text().replace(/^\s+|\s+$/gm, '')
              .split('\n')[0];
            if (error == null) {
              data.iliad[0] = 'true';
            } else {
              data.iliad[0] = errors;
            }
            res.send(data);
          });
        } catch (e) {
          res.sendStatus(503);
        }
      }
    });
  } else {
    res.sendStatus(400);
  }
};
