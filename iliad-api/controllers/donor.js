'use strict';

module.exports = (req, res) => {
  const data = {
    iliad: {},
  };
  const donors = [
    'Gian Mario Di Emilio',
    'Roberto Levantesi',
    'Leonardo Androvich',
    'David Metelli',
    'Miranda Seassaro',
    "Gianluca Spano'",
    'Emanuele De Carlo',
    'Marco Luciano',
    'Emilio Filiardi',
    "Luca Calio'",
    'Alessio Pierotti',
    'Riccardo Fusetti',
    'Marco Attolini',
    'Alistide Molinari',
    'Giancarlo De Simone',
    'Carmelo Rizzo Spurna',
    'Vito Muolo',
    'Alessandro Leonardi',
    'Paola Brasca',
  ];
  data.iliad[0] = donors;
  // res.send(data);
  let html = '<!DOCTYPE html><html><link href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous"><div class="modal-body"> <div class="row"><div class="col-lg-4 col-sm-12"><div class="list-group"><div class="list-group-item active">Donors</div>';
  donors.forEach((donor) => {
    html += `<div class="list-group-item">${donor}</div>`;
  });
  html += '</div></div></div></div></html>';

  res.send(html);
};
