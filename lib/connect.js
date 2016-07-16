var tmi = require('tmi.js');

var options = {
  options: {
    debug: true
  },
  connection: {
    reconnect: true
  },
  identity: {
    username: 'Unknown!',
    password: 'Nothings Here :('
  },
  channels: ['#NotInMyHouse']
};

var client = new tmi.client(options);

module.exports = {
  client: client
};
