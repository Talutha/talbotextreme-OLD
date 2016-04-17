var expect = require('chai').expect;
var dc = require('../lib/defaultCommands');

var moderator = {
  color: '#0000FF',
  'display-name': 'Talutha',
  emotes: null,
  mod: true,
  'room-id': '28368365',
  subscriber: false,
  turbo: false,
  'user-id': '15213012',
  'user-type': null,
  'emotes-raw': null,
  username: 'talutha',
  'message-type': 'chat'
}

var user = {
  color: '#0000FF',
  'display-name': 'Talutha',
  emotes: null,
  mod: false,
  'room-id': '28368365',
  subscriber: false,
  turbo: false,
  'user-id': '15213012',
  'user-type': null,
  'emotes-raw': null,
  username: 'talutha',
  'message-type': 'chat'
}

describe("Command responses", function() {
  it("should be true if command exists", function() {
    var commandExists = dc.defaultCommands(user, "!points", "#talutha");

    expect(commandExists).to.be.true;
  });

  it("should be false if command does not exist", function() {
    var commandNotExist = dc.defaultCommands(user, '!!!not@Command', "#talutha");

    expect(commandNotExist).to.be.false;
  })

  it("responds to !points with a string", function(done) {
    var points = dc.defaultCommands(user, "!points", "#talutha", function(result) {
      expect(result).to.be.a('string');
      done();
    });
  })

  it('refuses to add commands to non-moderators', function(done) {
    var newCommand = '!add !!t@stCommand testing!';
    var commandName = '!!t@stCommand';

    var refuseCom = dc.defaultCommands(user, newCommand, '#talutha', function(result) {
      expect(result).to.have.string('You must be a moderator to use this command.');
      done();
    });
  });

  it('successfully adds a new command', function(done) {
    var newCommand = '!add !!t@stCommand testing!';
    var commandName = '!!t@stCommand';

    var addCom = dc.defaultCommands(moderator, newCommand, '#talutha', function(result) {
        expect(result).to.have.string('Successfully added the command ' + commandName + '.');
        done();
    });

  });

  it('returns an error when a command exists', function(done) {
    var newCommand = '!add !!t@stCommand testing!';
    var commandName = '!!t@stCommand';

    var comExists = dc.defaultCommands(moderator, newCommand, '#talutha', function(result) {
      expect(result).to.have.string('The command ' + commandName + ' already exists.');
      done();
    });

  });

  it('refuses to remove a command to non-moderators', function(done) {
    var newCommand = '!remove !!t@stCommand';

    var refuseRemCom = dc.defaultCommands(user, newCommand, '#talutha', function(result) {
        expect(result).to.have.string('You must be a moderator to use this command.');
        done();
    });
  });

  it('removes a command or returns an error', function(done) {
    var newCommand = '!remove !!t@stCommand';
    var commandName = '!!t@stCommand';

    var remCom = dc.defaultCommands(moderator, newCommand, '#talutha', function(result) {
      expect(result).to.have.string('Successfully removed the command ' + commandName + '.')
      done();
    });
  });

});

describe('Altering Points', function() {

  var addThis = '!addpoints Talutha 500';
  var removeThis = '!addpoints Talutha -500';
  var amount = 500;
  var person = 'talutha';

  it('does not allow non-broadcasters to alter points', function(done) {
    var denyPoints = dc.defaultCommands(moderator, addThis, '#NOTTalutha', function(result) {
      expect(result).to.have.string('Only the broadcaster may alter points.');
      done();
    });
  });

  it('allows the broadcaster to add points', function(done) {
    var addPoints = dc.defaultCommands(moderator, addThis, '#talutha', function(result) {
      expect(result).to.have.string('Added ' + amount + ' points to ' + person + '.');
      done();
    });
  });

  it('allows the broadcaster to remove points', function(done) {
    var remPoints = dc.defaultCommands(moderator, removeThis, '#talutha', function(result) {
      expect(result).to.have.string('Removed ' + -(amount) + ' points from ' + person + '.');
      done();
    });
  });

});

describe('Lineup Game', function() {
  var lineCommand = '!startaline 500 Line up here!'

  it('does not allow regular users to start a line', function(done) {
    var denyLine = dc.defaultCommands(user, lineCommand, '#talutha', function(result) {
      expect(result).to.have.string('You must be a moderator to start a line.');
      done();
    });
  });

  it('allows a moderator to start a line', function(done) {
    var startingLine = dc.defaultCommands(moderator, lineCommand, '#talutha', function(result) {
      expect(result).to.have.string('Talutha has started a line for: Line up here! - !lineup for 500 points!');
      done();
    });
  });

})
