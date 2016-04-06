var irc = require('tmi.js');
var fs = require('fs');
var jsonfile = require('jsonfile');

// If config does not exist, run config program.
function checkFile(dir, file, callback) {
  fs.stat(file, function(err, stats) {
    if (err && err.errno === -4058 || process.argv[2] === '-reconfigure') {
      // create file and populate it
      try {
        fs.mkdirSync(dir)
      } catch(e) {};
      fs.openSync(dir + file, 'w');
      console.log('Config file created!');
      fillConfig(dir, file, callback);
    } else {
      callback();
    }
  })
}

// Function that runs if config file is not found.  Gets important information
// from the user such as username and password for TMI connection.  This should
// not run except if the config file/folder is not found or if specifically
// requested by the user with the --reconfigure argument
function fillConfig(dir, file, callback) {
  var prompt = require('prompt');
  var file = dir + file;
  var config = {};

  prompt.start();

  prompt.get(['Twitch Username', 'Twitch OAUTH'], function(err, results) {
    if (err) console.log(err);
    config.username = results['Twitch Username'];
    config.oauth = results['Twitch OAUTH'];
    console.log('Username recorded as: ' + config.username);
    console.log('OAUTH recoded as: ' + config.oauth);
    jsonfile.writeFile(file, config, {spaces: 4}, function(err) {
      if (err) console.log(err);
    })
  })

}

var options = {
  options: {
    debug: true
  },
  connection: {
    cluster: 'aws',
    reconnect: true
  },
  identity: {
    username: '',
    password: ''
  }
}

checkFile('./config/', 'config.json', function() {});
