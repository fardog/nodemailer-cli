var should = require('should');
var stub = require('nodemailer-stub-transport');
var Cli = require('../lib/cli');
var Mailer = require('../lib/mailer');
var path = require('path');

var attachment1 = path.join(__dirname, '..', 'index.js');
var attachment2 = path.join(__dirname, '..', 'package.json');
var bodyText = path.join(__dirname, '..', 'README.md');

var emailWithAttachment = [
  '-t', 'gmail', '-u', 'test', '-p', 'testpass', '--attachment', attachment1,
  'you@email.com', 'me@email.com', '-j', 'test subject'
];

var emailWithAttachments = [
  '-t', 'gmail', '-u', 'test', '-p', 'testpass', '--attachment', attachment1,
  '--attachment', attachment2,
  'you@email.com', 'me@email.com', '-j', 'test subject'
];

var emailWithSubjectAndBody = [
  '-t', 'gmail', '-u', 'test', '-p', 'testpass', 'you@email.com',
  'me@email.com', '-j', 'test subject', 'test body'
];

var emailWithSubjectAndBodyFile = [
  '-t', 'gmail', '-u', 'test', '-p', 'testpass', '--body', bodyText,
  'you@email.com', 'me@email.com', '-j', 'test subject'
]

console.log(bodyText);

describe('mailer', function() {
  it('should successfully build an email with attachment', function(done) {
    var cli = new Cli().parse(emailWithAttachment);
    var mailer = new Mailer(cli.parsedOptions, stub);

    mailer.buildMessage(cli.parsedOptions).sendMail(function(err, result) {
      should(err).equal(null);
      result.response.toString().should.containEql('index.js');
      done();
    });
  });
  it('should successfully build an email with two attachments', function(done) {
    var cli = new Cli().parse(emailWithAttachments);
    var mailer = new Mailer(cli.parsedOptions, stub);

    mailer.buildMessage(cli.parsedOptions).sendMail(function(err, result) {
      should(err).equal(null);
      result.response.toString().should.containEql('index.js');
      result.response.toString().should.containEql('package.json');
      done();
    });
  });
  it('should successfully build an email with a body', function(done) {
    var cli = new Cli().parse(emailWithSubjectAndBody);
    var mailer = new Mailer(cli.parsedOptions, stub);

    mailer.buildMessage(cli.parsedOptions).sendMail(function(err, result) {
      should(err).equal(null);
      result.response.toString().should.containEql('test body');
      done();
    });
  });
  it('should successfully build an email with a body file', function(done) {
    var cli = new Cli().parse(emailWithSubjectAndBodyFile);
    var mailer = new Mailer(cli.parsedOptions, stub);

    mailer.buildMessage(cli.parsedOptions).sendMail(function(err, result) {
      should(err).equal(null);
      result.response.toString().should.containEql('Nathan Wittstock');
      done();
    });
  });
});
