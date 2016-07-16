/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

const tmi = require('./lib/connect').client;
const chat = require('./lib/chat');
const config = require('./lib/config');

config.checkForConfig('./config/', 'config.json')
      .then(tmi.connect());

tmi.on('chat', function(channel, user, message, self) {
  // Self returns BOOLEAN if chatter is the same as the bot
  // Channel returns #channel-name
  // Message returns message as a string
  // User returns a user object:
  /*
  USER: {"badges":null,
         "color":"#0000FF",
         "display-name":"Talutha",
         "emotes":null,
         "id":"969bd3aa-388a-41ba-878b-21fb7f8db51d",
         "mod":false,
         "room-id":"28368365",
         "subscriber":false,
         "turbo":false,
         "user-id":"15213012",
         "user-type":null,
         "emotes-raw":null,
         "badges-raw":null,
         "username":"talutha",
         "message-type":"chat"}
  */
  chat.parseChat(channel, user, message, self);
});
