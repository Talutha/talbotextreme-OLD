"use strict";

var db = require('./database.js');

exports.defaultCommands = function(user, message, channel, cb) {

  // Split the message up and handle all parts individually
  var messageSplit = message.split(' ');
  message = messageSplit.shift();

  // Allow different commands for points so people don't get confused.
  if (message === '!pants' || message === '!missing_pants' || message === '!missingpants') {
    message = '!points'
  }

  // object containing all default commands/functions
  // all commands should have callbacks to return when they are ready
  var commands = {
    '!howdy':   function() {
                  cb('Howdy there ' + user['display-name'] + '!')
                },
    '!points':  function() {
                  var username = user['username'];
                  db.getPoints(username).then(function(points) {
                    cb(user['display-name'] + ', you currently have ' + points + ' points.')
                  })
                },
    // Function to add new commands to the DB
    // Chat Input: !add !howdy Howdy there partner!
    '!add':     function() {
                  if (!user['mod']) {
                    cb('You must be a moderator to use this command.');
                    return false;
                  }
                  var newCommand = messageSplit.shift();
                  var newOutput = messageSplit.join(' ');
                  db.addCommand(newCommand, newOutput).then(function(model) {
                    cb('Successfully added the command ' + newCommand + '.');
                  }).catch(function(e) {
                    if (e.code === '23505') {
                      cb('The command ' + newCommand + ' already exists.');
                    } else {
                      console.log(e);
                      cb('There was an unknown error adding the command ' + newCommand + '.  Please try again or with another command name.(' + e.code + ')');
                    }
                  })
                },
    // Removes commands from DB
    // Chat Input: !remove !howdy
    '!remove':  function() {
                  if (!user['mod']) {
                    cb('You must be a moderator to use this command');
                    return false;
                  }
                  var remCommand = messageSplit.join('');
                  db.getCommand(remCommand).then(function(model) {
                    if (model === null) {
                      cb('The command ' + remCommand + ' does not exist.');
                    } else {
                      db.remCommand(remCommand).then(function() {
                        cb('Successfully removed the command ' + remCommand + '.');
                      })
                    }
                  })
                },

    // Add points to specific user/users
    // Chat Input: !addpoints Talutha/Online/All 500
    '!addpoints': function() {
                    if (channel.replace('#', '') === user['username']) {
                      console.log('User is broadcaster');
                    } else {

                    }
                  }
  };

  // returns a boolean depending if a command exists or not.
  if (!commands.hasOwnProperty(message) && cb === undefined) {
    return false;
  } else if (cb === undefined) {
    return true;
  };

  commands[message]();
};
