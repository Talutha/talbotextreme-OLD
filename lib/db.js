/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

const config = require('../config/config.json');
const knex = require('knex') ({
  client: 'pg',
  connection: {
    host: config['SQL Host Address'],
    user: config['SQL Username'],
    password: config['SQL Password'],
    database: config['SQL Database'],
    charset: 'utf8'
  }
});
const bookshelf = require('bookshelf')(knex);

const userCommands = bookshelf.Model.extend({
  tableName: 'user_commands_talutha',
  idAttribute: 'username'
});

module.exports = {
  userCommands: userCommands,

// This command does not work at all, something is wrong with how I am handling
// the promise
  getCommand: function(command) {
    let fetchedCommand = userCommands.where({command: command}).fetch()
        .then((model) => {
          console.log(model);
          return model;
        });
    return fetchedCommand;
  }
};
