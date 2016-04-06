var irc = require('tmi.js');
var fs = require('fs');
var jsonfile = require('jsonfile');


// If config does not exist, run config program.
function checkFile(dir, file, callback) {
  fs.stat(dir + file, function(err, stats) {
    if (err && err.errno === -4058 || process.argv[2] === '--reconfigure') {
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

  console.log('Welcome to TalBotExtreme!');
  console.log("This is a Twitch.tv bot programmed by Marvin 'Talutha' Warren in Javascript.");
  console.log('');
  console.log('');
  console.log('It appears this is the first time you are running the bot, let me ask you some questions so that you can get back to casting faster!');


  prompt.start();

  prompt.get(['Twitch Username',
              'Twitch OAUTH',
              'Channels to Join',
              'SQL Host',
              'SQL User',
              'SQL Password',
              'SQL Database'], function(err, results) {
    if (err) console.log(err);
    config.username = results['Twitch Username'];
    config.oauth = results['Twitch OAUTH'];
    config.channels = [];
    config.channels.push(results['Channels to Join']);
    config.sqlHost = results['SQL Host'];
    config.sqlUser = results['SQL User'];
    config.sqlPass = results['SQL Password'];
    config.sqlDB = results['SQL Database'];
    console.log('Username recorded as: ' + config.username);
    console.log('OAUTH recoded as: ' + config.oauth);
    console.log('Channels to join: ' + config.channels);
    jsonfile.writeFile(file, config, {spaces: 4}, function(err) {
      if (err) console.log(err);
    })
  })

}


checkFile('./config/', 'config.json', function() {
  var config = jsonfile.readFileSync('./config/config.json');

  var options = {
    options: {
      debug: true
    },
    connection: {
      cluster: 'aws',
      reconnect: true
    },
    identity: {
      username: config.username,
      password: config.oauth
    },
    channels: config.channels
  }

  var client = new irc.client(options);

  client.connect();

  client.on("chat", function(channel, user, message, self) {
    console.log(user);
    if (message === 'Howdy!') {
      client.say(channel, "Howdy " + user['display-name']+ '!');
    }
  });

});
