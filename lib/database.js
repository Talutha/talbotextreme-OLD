"use strict";

var jsonFile = require('jsonfile');
var config = jsonFile.readFileSync('./config/config.json');

// Configuration options for Knex/Bookshelf for database access
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

// Creates bookshelf.js references to all of the tables we are using
var userTracking = bookshelf.Model.extend({
  tableName: 'user_tracking_talutha',
  idAttribute: 'username'
});

var userCommands = bookshelf.Model.extend({
  tableName: 'user_commands_talutha',
  hasTimestamps: ['created_on'],
  idAttribute: 'command'
});

// This SHOULD create the database schema when called but it does not work
// I think I need to put this in another file and call it from the CLI
// NOT FUNCTIONAL
function createTables(channel) {
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

module.exports = {
  createTables: createTables,
  getPoints: getPoints,
  alterPoints: alterPoints,
  getCommand: getCommand,
  addCommand: addCommand,
  remCommand: remCommand
}

// Returns only a specific users points
// You MUST use .then when using any of the following functions
function getPoints(name) {
  return userTracking.where({username: name}).fetch().then(function(model) {
    return Number(model.get('points'));
  });
}

function alterPoints(name, newPoints) {
  console.log ('name: ' + name + ' points: ' + newPoints);
  return getPoints(name).then(function(currentPoints) {
    newPoints = Number(newPoints) + currentPoints;
    new userTracking({username: name, points: newPoints}).save(null, {method: 'update'});
  })
}

// Returns all columns from userCommands
function getCommand(command2) {
  return userCommands.where({command: command2}).fetch();
}

function addCommand(newCommand, newOutput) {
  return new userCommands({command: newCommand, output: newOutput, level: 0}).save(null, {method: 'insert'});
}

function remCommand(remCommand) {
  return new userCommands({command: remCommand}).destroy();
}
