/*jslint node: true */
/*jslint esversion: 6 */
'use strict';
module.exports = {
  chatTest: function(tmi, channel, user, message, self) {
    tmi.say(channel, 'Test Successful ' + user.username + '!');
  },

  parseChat: function(tmi, channel, user, message, self) {
    if (self || message[0] !== '!') return false;
    message = message.split(' ');
    this.checkForCommand(tmi, channel, user, message);
  },

  checkForCommand: function(tmi, channel, user, message) {
    message[0] = message[0].slice(1);
    if (this.defaultCommands.hasOwnProperty(message[0])) {
      this.defaultCommands[message[0]](tmi, channel, user, message);
    }
  },

  defaultCommands: {
    howdy: function(tmi, channel, user, message) {
      tmi.say(channel, 'Howdy ' + user['display-name'] + '!');
    }
  }
};
