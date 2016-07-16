/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

const tmi = require('./connect').client;

module.exports = {
  chatTest: function(channel, user, message, self) {
    tmi.say(channel, 'Test Successful ' + user.username + '!');
  },

  parseChat: function(channel, user, message, self) {
    if (self || message[0] !== '!') return false;
    message = message.split(' ');
    this.checkForCommand(channel, user, message);
  },

  checkForCommand: function(channel, user, message) {
    message[0] = message[0].slice(1);
    if (this.defaultCommands.hasOwnProperty(message[0])) {
      this.defaultCommands[message[0]](channel, user, message);
    }
  },

  defaultCommands: {
    howdy: function(channel, user, message) {
      tmi.say(channel, 'Howdy ' + user['display-name'] + '!');
    }
  }
};
