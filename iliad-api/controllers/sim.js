'use strict';

const request = require('request');
const cheerio = require('cheerio');

const constants = require('../constants');

module.exports = (req, res) => {
  res.set('Content-Type', 'application/json');

  const {
    iccid,
    token,
    // eslint-disable-next-line camelcase
    activation_sim,
  } = req.query;

  const headers = {
    cookie: `ACCOUNT_SESSID=${token}`, // cookie di accesso
  };

  const data = {
    iliad: {},
  };

  if (iccid !== undefined && token !== undefined) {
    const formData = {
      iccid,
    };

    const options = {
      url: `${constants.ILIAD_BASE_URL}${constants.ILIAD_OPTION_URL.activation}`,
      method: 'POST',
      headers,
      formData,
    };
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        try {
          const $ = cheerio.load(body);
          const results = $('body');
          results.each((i, result) => {
            data.iliad.sim = {};

            const simData = $(result)
              .find('div.flash-error').text().replace(/^\s+|\s+$/gm, '')
              .split('\n');

            const [, sim] = simData;
            if (sim !== 'L\'état actuel de votre SIM ne requiert aucune activation.' && sim !== 'Cette SIM a été résiliée et ne peux plus être utilisée.') {
              data.iliad.sim[0] = sim;
              data.iliad.sim[1] = 'false';
            } else {
              data.iliad.sim[0] = sim;
              data.iliad.sim[1] = 'true';
            }

            res.send(data);
          });
        } catch (exeption) {
          res.sendStatus(503);
        }
      }
    });
    // eslint-disable-next-line camelcase
  } else if (activation_sim === 'true' && token !== undefined) {
    const options = {
      url: `${constants.ILIAD_BASE_URL}attivazione-della-sim`,
      method: 'GET',
      headers,
    };
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        try {
          const $ = cheerio.load(body);
          const results = $('body');
          let array = [];
          let array2 = [];
          let array3 = [];

          results.each((i, result) => {
            data.iliad.validation = {};
            data.iliad.shipping = {};
            data.iliad.sim = {};

            $(result)
              .find('h2.title')
              .each((index, element) => {
                array = array.concat([$(element).text()]);
              });
            $(result)
              .find('div.grid-l')
              .find('div.step__text')
              .each((index, element) => {
                array3 = array3.concat([$(element).find('a').text()]);
                array2 = array2.concat([$(element).find('h4.step__text__title').text()]);
              });
            const orderdate = $(result).find('div.step__text').first().text()
              .split('\n');
            const tracking = $(result).find('a.red').attr('href');
            const activation = $(result).find('p.explain').text().replace(/^\s+|\s+$/gm, '')
              .split('\n')[0];
            const check = $(result).find('div.step__text').find('p.green').text();
            // eslint-disable-next-line camelcase
            const order_shipped = $(result).find('div.step__text').find('p').html();
            let title = '';
            $(result).find('h4.step__text__title')
              .each((index, element) => {
                if (index === 3) {
                  title = $(element).text();
                }
              });
            // var preparazione = array2[1]

            // eslint-disable-next-line camelcase
            if (order_shipped != null) {
              // eslint-disable-next-line camelcase
              data.iliad.shipping[1] = order_shipped;
            } else { // order shipped
              data.iliad.shipping[1] = 'Non disponibile';
            }
            if (tracking !== undefined) {
              data.iliad.shipping[3] = tracking;
            } // tracking
            if (title !== undefined) {
              data.iliad.sim[0] = title;
            } else { // title
              data.iliad.sim[0] = 'Non disponibile';
            }
            if (activation !== undefined) {
              data.iliad.sim[1] = activation;
            } else { // attivazione
              data.iliad.sim[1] = 'Non disponibile';
            }

            data.iliad.sim[2] = check === 'SIM attivata' ? 'true' : 'false';

            data.iliad.sim[3] = array[0].split('\n')[1].replace(/^\s+|\s+$/gm, ''); // offert
            const [, , shipping] = array3;
            data.iliad.shipping[2] = shipping;

            const [validation] = array2;
            data.iliad.validation[0] = validation; // validation
            data.iliad.validation[1] = orderdate[2].replace(/^\s+|\s+$/gm, ''); // order date
            data.iliad.validation[2] = orderdate[3].replace(/^\s+|\s+$/gm, ''); // date

            const [, , trackingCode] = array3;
            data.iliad.shipping[2] = trackingCode; // tracking text

            const [, , shippingCode] = array2;
            data.iliad.shipping[0] = shippingCode; // spedizione

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
