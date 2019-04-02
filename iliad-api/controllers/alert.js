'use strict';

module.exports = (req, res) => {
  res.set('Content-Type', 'application/json');

  const data = {
    iliad: {},
  };

  data.iliad[0] = 'L’app è stata creata in modo <b>NON</b> ufficiale, iliad S.P.A non è responsabile. L’app prende le informazioni dal sito, se una sezione/testo/oggetto non c’è sul sito non ci sarà nell’app. Ti ricordo inoltre che prima di creare una valutazione sul PlayStore di contattarci su Telegram con <b>@Fast0n</b> o <b>@Mattvoid</b> oppure per email all’indirizzo <b>theplayergame97@gmail.com</b>.<br/>Grazie per l’attenzione.';
  res.send(data);
};
