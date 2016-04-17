"use strict";

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

  // Using prompt.js to get user input from CLI.  There should be a cleaner and
  //  more efficient way to do this.  Especially to allow multiple channels to be
  //  input.  May take a look at this again later if I decide to make the bot more
  //  user friendly.
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
  var db = require('./database.js');
  var dc = require('./defaultCommands');
  var config = jsonfile.readFileSync('./config/config.json');

  // TMI.js options
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

  // This is supposed to create a database for each channel given but it does
  //  not work.
  // I may revisit this if I decide to make the bot more user friendly but
  //  for now you will need to create the schema manually.  Good luck!
  for (var x = 0; x < config.channels.length; x++) {
    console.log(config.channels[x]);
    db.createTables(config.channels[x]);
  }

  // Responds to any chat events
  // user returns an object. This object can change at any time according to Twitch
  //  so if something breaks, check here first
  client.on("chat", function(channel, user, message, self) {
    console.log(user);
    // pull username from user object
    var username = user['username']
    // Check all chat commands to see if they are default commands.
    // Might be able to improve performance by ensuring that it only checks
    //  messages that start with a '!'
    if (dc.defaultCommands(user, message)) {
      dc.defaultCommands(user, message, channel, function(result) {
        client.say(channel, result);
      });
    // If message is not in default commands and it starts with '!', check the
    //  database to see if command exists.
    } else if (message[0] === '!'){
      db.getCommand(message.toLowerCase()).then(function(model) {
        if (model !== null) {
          var sendThis = model.get('output');
          client.say(channel, sendThis);
        }
      })
    }
  });

});
