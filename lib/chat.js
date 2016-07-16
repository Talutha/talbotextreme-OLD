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

  checkForCommand: function(tmi, channel, user, message) {}
};
