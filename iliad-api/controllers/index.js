'use strict';

const alert = require('./alert');
const root = require('./root');
const login = require('./login');
const logout = require('./logout');
const recover = require('./recover');
const token = require('./token');
const sim = require('./sim');
const information = require('./information');
const credit = require('./credit');
const services = require('./services');
const document = require('./document');
const options = require('./options');
const recharge = require('./recharge');
const voicemail = require('./voicemail');
const store = require('./store');
const donor = require('./donor');

module.exports = {
  root,
  alert,
  login,
  logout,
  recover,
  token,
  sim,
  information,
  credit,
  services,
  document,
  options,
  recharge,
  voicemail,
  store,
  donor,
};
