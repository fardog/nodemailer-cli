var should = require('should');
var utils = require('../lib/utils.js');
var validateEmails = utils.validateEmails;

// note that we use isemail internally, so we only test functionality of our wrapper,
// and not thorough tests of email parsing.
describe('email validator', function() {
  it('should allow valid emails', function() {
    var invalid = validateEmails('to', false, 'you@email.co');

    invalid.should.equal(false);
  });
  it('should allow multiple emails in an array', function() {
    var invalid = validateEmails('to', true, ['you@email.co', 'me@email.co']);

    invalid.should.equal(false);
  });
  it('should allow multiple emails in a comma separated string', function() {
    ["you@email.co, me@email.co",
     "you@email.co,me@email.co,metwo@email.com",
     "you@email.co   ,  me@email.co,  metwo@email.co  ,methree@email.net"]
    .forEach(function(emailSet) {
      var invalid = validateEmails('to', true, emailSet);
      invalid.should.equal(false);
    });
  });
  it('should not allow multiple emails if we ask it not to', function() {
    ["you@email.co, me@email.co",
     "you@email.co,me@email.co,metwo@email.com",
     "you@email.co   ,  me@email.co,  metwo@email.co  ,methree@email.net",
     ["you@email.co", "me@email.co"]]
    .forEach(function(emailSet) {
      var invalid = validateEmails('to', false, emailSet);
      invalid.should.be.type('string');
    });
  });
  it('should not allow blank emails', function() {
    ['', ',', ' '].forEach(function(email) {
      var invalidSingle = validateEmails('to', false, email);
      var invalidMultiple = validateEmails('to', true, email);
      invalidSingle.should.be.type('string')
      invalidMultiple.should.be.type('string');
    });
  });
});


