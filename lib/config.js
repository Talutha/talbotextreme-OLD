/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

const fs = require('fs');
const jsonfile = require('jsonfile');

// Check if config file exists
let checkFile = (dir, file) => {
  return new Promise((resolve, reject) => {
    console.log('Checking for Configuration File');
    fs.stat(dir + file, (err, stats) => {
      // error -2 = file/dir not found
      if (err && err.errno === -2 || process.argv[2] === '--reconfigure') {
        console.log('Configuration not found, attempting to create it.');
        // create file and populate it
        try {
          fs.mkdirSync(dir);
        } catch(e) {
          // Do not show error of directory already exists
          if (e.errno !== -17) {
            console.log(e);
          }
        }

        fs.openSync(dir + file, 'w');
        console.log('Config file was created!');
        fillConfig(dir, file);
      } else console.log('Configuration Found and Loaded');
      resolve();
    });
  });
};

let fillConfig = (dir, file) => {
  file = dir + file;
  let config = {
    'Twitch Username': 'BottyBot',
    'Twitch Oauth': 'oauth:ThisIsNotARealCode',
    'Channels to Join': ['#channel-one', '#channel-two'],
    'SQL Host Address': 'localhost',
    'SQL Username': 'SqueelLogin',
    'SQL Password': 'NotVerySecure',
    'SQL Database': 'BotDb'
  };

  jsonfile.writeFile(file, config, {spaces: 4}, (err) => {
    if (err) console.log(err);
  });
};

exports.checkForConfig = checkFile;
