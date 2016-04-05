var irc = require('tmi.js');
var fs = require('fs');

// If config does not exist, run config program.
function checkFile(dir, file, callback) {
  fs.stat(file, function(err, stats) {
    if (err && err.errno === -4058) {
      // create file and populate it
      fs.mkdir(dir);
      fs.openSync(dir + file, 'w');
      console.log('Config file created!');
    } else {
      callback();
    }
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
