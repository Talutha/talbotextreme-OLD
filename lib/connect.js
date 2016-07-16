/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

const tmi = require('tmi.js');
const config = require('../config/config.json');

var options = {
  options: {
    debug: true
  },
  connection: {
    reconnect: true
  },
  identity: {
    username: config['Twith Username'],
    password: config['Twitch Oauth']
  },
  channels: config['Channels to Join']
};

var client = new tmi.client(options);

module.exports = {
  client: client
};
