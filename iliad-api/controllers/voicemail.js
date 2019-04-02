/* eslint-disable security/detect-object-injection */

'use strict';

const request = require('request');
const cheerio = require('cheerio');

const constants = require('../constants');

module.exports = (req, res) => {
  // res.set('Content-Type', 'application/json');

  const {
    token,
    deleteaudio,
    idaudio,
    voicemailoptions,
    voicemailreport,
    email,
    action,
    type,
    voicemail,
    update,
    changevoicemailoptions,
    activate,
    codemessagerie,
    announce,
  } = req.query;

  const data = {
    iliad: {},
  };

  const headers = {
    cookie: `ACCOUNT_SESSID=${token}`, // cookie di accesso
  };

  if (voicemail === 'true' && token !== undefined) {
    // Richiesta messaggi in segreteria
    const options = {
      url: `${constants.ILIAD_BASE_URL}${constants.ILIAD_OPTION_URL.voicemail}`,
      method: 'GET',
      headers,
    };

    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        try {
          const $ = cheerio.load(body);
          const results = $('body');
          results.each((i, result) => {
            data.iliad[0] = {};
            data.iliad[0][0] = $(result).find('h1').first().text()
              .replace(/^\s+|\s+$/gm, '');
            if ($(result).find('p.text-center').text().replace(/^\s+|\s+$/gm, '') === '') {
              $(result)
                .find('div.msg')
                .each((index, element) => {
                  const newindex = index + 1;

                  data.iliad[newindex] = {};

                  data.iliad[newindex][0] = {};
                  data.iliad[newindex][1] = {};
                  data.iliad[newindex][2] = {};

                  data.iliad[newindex][0] = $(element).find('div.msg__details__tel').text().replace(/^\s+|\s+$/gm, '');
                  data.iliad[newindex][1] = $(element).find('div.msg__details__date').text().replace(/^\s+|\s+$/gm, '')
                    .replace('\n', ' ')
                    .replace('(', '(<span style="color:#cc0000">')
                    .replace(')', '</span>)');
                  const [, line] = $(element).find('source').attr('src').split('=');
                  data.iliad[newindex][2] = line;
                  // data.iliad[index][2] = 'https://www.iliad.it' + $(element).find('source').attr('src');
                });
            } else {
              data.iliad[0] = {};
              data.iliad[0][0] = $(result).find('p.text-center').text().replace(/^\s+|\s+$/gm, '');
            }
            res.send(data);
          });
        } catch (exeption) {
          res.sendStatus(503);
        }
      }
    });
  } else if (deleteaudio === 'true' && idaudio !== undefined && token !== undefined) {
    // Eliminazione messaggio in segreteria
    const options = {
      url: `${constants.ILIAD_BASE_URL}${constants.ILIAD_OPTION_URL.voicemail}/messaggio_vocale?id=${idaudio}&action=delete`,
      method: 'GET',
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
      if (!error && response.statusCode === 200) {
        try {
          data.iliad[0] = {};
          data.iliad[1] = {};

          data.iliad[0] = body[0].result.success;
          data.iliad[1] = body[0].result.msg;

          res.send(data);
        } catch (exeption) {
          res.sendStatus(503);
        }
      }
    });
  } else if (idaudio !== undefined && token !== undefined) {
    // Richiesta singolo messaggio (per id) da segreteria
    const options = {
      url: `${constants.ILIAD_BASE_URL}${constants.ILIAD_OPTION_URL.voicemail}/messaggio_vocale?id=${idaudio}`,
      method: 'GET',
      headers,
      encoding: null,
    };
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        try {
          res.send(body);
        } catch (exeption) {
          res.sendStatus(503);
        }
      }
    });
  } else if (voicemailoptions === 'true' && token !== undefined) {
    // Richiesta opzioni segreteria
    const options = {
      url: `${constants.ILIAD_BASE_URL}${constants.ILIAD_OPTION_URL.voicemail}`,
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
          results.each((i, result) => {
            const title = $(result).find('h2').first().text()
              .replace(/^\s+|\s+$/gm, '');

            $(result)
              .find('div.as__status--active')
              .each((index, element) => {
                text = text.concat([$(element).find('span.as__status__text').text()]);
                status = status.concat([$(element).find('i').attr('class')]);
              });
            $(result)
              .find('div.as__item__name')
              .each((index, element) => {
                array3 = array3.concat([$(element).find('div.inner').text().replace(/^\s+|\s+$/gm, '')]);
              });

            const query = [
              '0',
              '1',
              '2',
              '3',
            ];

            const service = {};

            for (let x = 0; x < 5; x += 1) {
              service[x] = [];
            }
            for (let x = 0; x < Object.keys(service).length - 1; x += 1) {
              service[x][0] = array3[x];
              service[x][1] = text[x];
              service[x][2] = (status[x] === 'icon i-check red') ? 'true' : 'false';
              service[x][3] = query[x];
            }

            for (let x = 0; x < 5; x += 1) {
              data.iliad[x] = {};
            }

            data.iliad[0][0] = title;

            for (let x = 0; x < Object.keys(service).length - 1; x += 1) {
              for (let y = 0; y < service[x].length; y += 1) {
                data.iliad[x + 1][y] = service[x][y];
              }
            }
            res.send(data);
          });
        } catch (exeption) {
          res.sendStatus(503);
        }
      }
    });
  } else if (changevoicemailoptions === 'true' && activate !== undefined && update !== undefined && token !== undefined) {
    let options = {};
    if (codemessagerie !== undefined) {
      options = {
        url: 'https://www.iliad.it /account/segreteria-telefonica',
        method: 'POST',
        headers,
        formData: {
          update,
          activate,
          'code-messagerie': codemessagerie,
        },
      };
    } else if (announce !== undefined) {
      options = {
        url: 'https://www.iliad.it /account/segreteria-telefonica',
        method: 'POST',
        headers,
        formData: {
          update,
          activate,
          announce,
        },
      };
    } else {
      options = {
        url: `https://www.iliad.it/account/segreteria-telefonica?update=${update}&activate=${activate}`,
        method: 'GET',
        headers,
      };
    }
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
  } else if (voicemailreport === 'true' && token !== undefined) {
    const options = {
      url: `${constants.ILIAD_BASE_URL}${constants.ILIAD_OPTION_URL.voicemail}`,
      method: 'GET',
      headers,
    };
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        try {
          const $ = cheerio.load(body);
          const results = $('body');

          results.each(() => {
            if ($(results).find('div.notifs__list').find('div.notifs__item').find('span.mdc-text-field__label')
              .text()
              .replace(/^\s+|\s+$/gm, '') !== '') {
              data.iliad[0] = {};
              data.iliad[1] = {};
              $(results)
                .find('h2')
                .each((index, element) => {
                  if (index === 1) {
                    data.iliad[0][0] = $(element).text().replace(/^\s+|\s+$/gm, '');
                  }
                });
              $(results)
                .find('div.notifs__explain')
                .find('p')
                .each((index, element) => {
                  if (index === 0) {
                    data.iliad[0][1] = $(element).text().replace(/^\s+|\s+$/gm, '');
                  } else if (index === 1) {
                    data.iliad[0][2] = $(element).text().replace(/^\s+|\s+$/gm, '');
                  }
                });
              $(results)
                .find('div.notifs__list')
                .find('div.notifs__item')
                .each((index, element) => {
                  const newindex = index + 1;
                  data.iliad[newindex] = {};
                  data.iliad[newindex][0] = $(element).find('span.mdc-text-field__label').text().replace(/^\s+|\s+$/gm, '');
                  data.iliad[newindex][1] = $(element).find('input.mdc-text-field__input').attr('value').replace(/^\s+|\s+$/gm, '');
                  data.iliad[newindex][2] = $(element).find('span.mdc-select__label').text().replace(/^\s+|\s+$/gm, '');
                  $(element).find('select.mdc-select__input').find('option').each((_, el) => {
                    if ($(element).attr('selected') === 'selected') {
                      data.iliad[newindex][3] = $(el).text().replace(/^\s+|\s+$/gm, '');
                    }
                  });
                });
            } else {
              data.iliad[0] = {};
              data.iliad[0][0] = 'Nessuna e-mail inserita.';
            }
            res.send(data);
          });
        } catch (exeption) {
          res.sendStatus(503);
        }
      }
    });
  } else if (email !== undefined && action !== undefined && token !== undefined) {
    // richiesta per aggiungere/eliminare le mail per la notifica della segreteria
    let url = `${constants.ILIAD_BASE_URL}${constants.ILIAD_OPTION_URL.voicemail}/notifiche?email=${email}&action=${action}`;

    if (type !== undefined) {
      url += `&type=${type}`;
    }

    const options = {
      url,
      method: 'GET',
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
      if (!error && response.statusCode === 200) {
        try {
          try {
            data.iliad[0] = body[0].result.msg;
          } catch (exeption) {
            data.iliad[0] = body[0].msg;
          }
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
