"use strict";

var db = require('./database.js');
var lu = require('./lineup.js');

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
    '!points':      points,
    '!add':         addCommand,
    '!remove':      removeCommand,
    '!addpoints':   alterPoints,
    '!startaline':  startaline,
    '!lineup':      lineUp
  };

  // returns a boolean depending if a command exists or not.
  if (!commands.hasOwnProperty(message) && cb === undefined) {
    return false;
  } else if (cb === undefined) {
    return true;
  };

  commands[message]();

  function points() {
    var username = user['username'];
    db.getPoints(username).then(function(points) {
      cb(user['display-name'] + ', you currently have ' + points + ' points.')
    });
  };

  // Function to add new commands to the DB
  // Chat Input: !add !howdy Howdy there partner!
  function addCommand() {
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
    });
  };

  // Removes commands from DB
  // Chat Input: !remove !howdy
  function removeCommand() {
    if (!user['mod']) {
      cb('You must be a moderator to use this command.');
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
    });
  };

  // Add points to specific user/users
  // Chat Input: !addpoints Talutha/Online/All 500
  // Force runs the function regardless of user level and ignores this functions callbacks
  function alterPoints(person, amount, force) {
    if (channel.replace('#', '') === user['username'] || force) {
      person = person || messageSplit[0].toLowerCase();
      amount = amount || messageSplit[1];
      db.alterPoints(person, amount).then(function() {
        if (amount < 0 && !force) {
          cb('Removed ' + amount + ' points from ' + person + '.');
        } else if (amount > 0 && !force) {
          cb('Added ' + amount + ' points to ' + person + '.');
        }
      })
    } else {
        cb('Only the broadcaster may alter points.');
    };
  };

  // Chat Input: !startaline 500 Line up now!
  function startaline() {
    if (!(user['mod'] || channel.replace('#', '') === user['username'])) {
      cb('You must be a moderator to start a line.');
      return false;
    }
    lu.lineUp.lineStarter = user['display-name'];
    lu.lineUp.lineCost = messageSplit.shift();
    lu.lineUp.lineDesc = messageSplit.join(' ');
    cb(lu.lineUp.startaline());
  };

  function lineUp() {
    db.getPoints(user['username']).then(function(points) {
      if (points >= lu.lineUp.lineCost) {
        var sub = user['subscriber'];
        var username = user['username'];
        if (lu.lineUp.lineUp(username, sub) === 'accepted') {
          alterPoints(username, -(lu.lineUp.lineCost), true);
          cb(user['display-name'] + ' has been added to the line.');
        };
      } else {
        cb(user['display-name'] + ', you do not have enough points to line up.')
      }
    });
  };



};
