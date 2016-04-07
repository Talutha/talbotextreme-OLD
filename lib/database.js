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
})

exports.getPoints = function(name) {
  return userTracking.where({username: name}).fetch();
}

// console.log(getPoints('talutha'));

// getPoints('talutha').then(function(model) {
//   console.log(model.get('points'));
// });
