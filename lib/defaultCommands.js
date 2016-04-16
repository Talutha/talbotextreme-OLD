var db = require('./database.js');


exports.defaultCommands = function(user, message, cb) {

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
    '!points':  function getPoints() {
                  username = user['username'];
                  db.getPoints(username).then(function(model) {
                    var points = model.get('points');
                    cb(user['display-name'] + ', you currently have ' + points + ' points.')
                  })
                },
    '!add':     function() {
                  newCommand = messageSplit.shift();
                  newOutput = messageSplit.join(' ');
                  console.log('New Command: ' + newCommand);
                  console.log('New Output: ' + newOutput);
                  db.addCommand(newCommand, newOutput).then(function(model) {
                    cb('Successfully added the command ' + newCommand);
                  })
                }
  }

  // returns a boolean depending if a command exists or not.
  if (!commands.hasOwnProperty(message) && cb === undefined) {
    return false;
  } else if (cb === undefined) {
    return true;
  }

  commands[message]();
}
