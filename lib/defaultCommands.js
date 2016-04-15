var db = require('./database.js');


exports.defaultCommands = function(user, message, cb) {

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
