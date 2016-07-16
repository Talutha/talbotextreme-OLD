/* jslint node: true */
/* jslint esversion: 6 */
/* jslint mocha: true */
/* jslint expr: true */
/* jslint -W024 */
'use strict';

const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

const chat = require('../lib/chat');
const tmi = require('../lib/connect').client;
const tmiShort = 'fake';

describe('Chat Test', function() {
  it('should return success', function() {
    let say = sinon.stub(tmi, 'say');
    let expectedChannel = '#talbotextreme';
    let expectedMessage = 'Test Successful Talutha!';
    let user = { username: 'Talutha' };

    chat.chatTest(expectedChannel, user, 'Nope');

    say.restore();
    sinon.assert.calledWith(say, expectedChannel, expectedMessage);
  });
});

describe('Parsing Chat', function() {

  let channel = '#testChannelPleaseIgnore';
  let user = 'TestUser';

  describe('parseChat', function() {
    it('should do nothing when bot is the sender', function() {
      let message = '!addpoints 900 testUser';
      let parsed = chat.parseChat(channel, 'Talbotextreme', message, true);
      expect(parsed).to.be.false;
    });

    it('should do nothing when message does not begin with "!"', function() {
      let message = 'Test message, please ignore!';
      let parsed = chat.parseChat(channel, user, message, false);
      expect(parsed).to.be.false;
    });

    it('should send default commands to checkForCommand', function() {
      let check = sinon.stub(chat, 'checkForCommand');
      let message = '!points';
      let parsed = chat.parseChat(channel, user, message, false);
      let splitMessage = message.split(' ');

      check.restore();
      sinon.assert.calledWith(check, channel, user, splitMessage);
    });
  });

  describe('checkForCommand', function() {
    it('sends default commands to defaultCommands()', function() {
      let defCom = sinon.stub(chat.defaultCommands, 'howdy');
      let message = ['!howdy'];
      let check = chat.checkForCommand(channel, user, message);

      defCom.restore();
      sinon.assert.calledWith(defCom, channel, user, message);
    });
    it('sends all other commands to checkDBFor()', function() {
      let message = ['!notADefaultCommand'];
      let check = sinon.stub(chat, 'checkDBFor');

      chat.checkForCommand(channel, user, message);

      check.restore();
      sinon.assert.calledWith(check, channel, user, message);
    });
  });

});
