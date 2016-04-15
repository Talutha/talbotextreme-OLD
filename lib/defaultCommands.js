var db = require('./database.js');


exports.defaultCommands = function(user, message, cb) {
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

  if (!commands.hasOwnProperty(message) && cb === undefined) {
    return false;
  } else if (cb === undefined) {
    return true;
  }

  commands[message]();
}
