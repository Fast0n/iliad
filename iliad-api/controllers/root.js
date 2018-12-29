'use strict';

module.exports = (req, res) => {
  res.set('text/html; charset=utf-8');
  res.send("<script>window.location.replace('http://areapersonale.mo3bius.com');</script>");
  // https://iliad-api-beta.glitch.me
};
