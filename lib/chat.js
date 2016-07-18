/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

const tmi = require('./connect').client;
const db = require('./db');

module.exports = {
  chatTest: function(channel, user, message, self) {
    if (self) return false;
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
    } else {
      this.checkDBFor(channel, user, message);
    }
  },

  checkDBFor: function(channel, user, message) {
    let fetchedMessage = db.getCommand(message);
    // This exists for older commands from the first Talbot that included
    // '!' in the database commands.  It creates TWO DB calls for every commands
    // that it fails to find.
    // TODO: Go through DB and remove '!' from all older commands.
    if (!fetchedMessage) {
      fetchedMessage = db.getCommand('!' + message);
    }
    if (fetchedMessage) {
      tmi.say(channel, fetchedMessage);
    }
  },

  defaultCommands: {
    howdy: function(channel, user, message) {
      tmi.say(channel, 'Howdy ' + user['display-name'] + '!');
    }
  }
};
