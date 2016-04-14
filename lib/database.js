var jsonFile = require('jsonfile');
var config = jsonFile.readFileSync('./config/config.json')

var dbConfig = {
  client: 'pg',
  connection: {
    host: config.sqlHost,
    user: config.sqlUser,
    password: config.sqlPass,
    database: config.sqlDB,
    charset: 'utf8'
  }
};

var knex = require('knex')(dbConfig);
var bookshelf = require('bookshelf')(knex);


var userTracking = bookshelf.Model.extend({
  tableName: 'user_tracking_talutha'
});

var userCommands = bookshelf.Model.extend({
  tableName: 'user_commands_talutha'
});

exports.createTables = function(channel) {
  channel = 'user_tracking_' + channel.slice(1);
  console.log('Attempting to create database for ' + channel);
  knex.schema.createTableIfNotExists(channel, function(table) {
    console.log('This finally ran!');
    table.text('username').primary().unique().notNullable(),
    table.text('follow_date'),
    table.text('sub_date'),
    table.boolean('sub').notNullable(),
    table.text('last_seen'),
    table.integer('user_level').notNullabe(),
    table.integer('points').notNullable(),
    table.decimal('time_watched'),
    table.timestamp('watching_now')
  });
}

exports.getPoints = function(name) {
  return userTracking.where({username: name}).fetch();
}

exports.getCommand = function(command2) {
  return userCommands.where({command: command2}).fetch();
}

// console.log(getPoints('talutha'));

// getPoints('talutha').then(function(model) {
//   console.log(model.get('points'));
// });
