var should = require('should');
var Cli = require('../lib/cli');

describe('cli', function() {
  it('should parse service options correctly', function() {
    var argv = ['--service', 'gmail'];
    var cli = new Cli().parse(argv);

    cli.parsedOptions.service.should.equal('gmail');
  });
  it('should allow the use of a service alias', function() {
    var argv = ['-t', 'gmail'];
    var cli = new Cli().parse(argv);

    cli.parsedOptions.service.should.equal('gmail');
  });
  it('should error when no to and from emails are present', function () {
    var argv = ['-t', 'gmail'];
    var cli = new Cli().parse(argv);

    cli.errors.should.have.length(2);
  });
  it('should flip the SSL flag correctly when requested', function() {
    var argv = ['--nossl'];
    var cli = new Cli().parse(argv);

    cli.parsedOptions.nossl.should.equal(true);
    cli.parsedOptions.useSSL.should.equal(false);
  });
  it('should accept only one "from" address', function() {
    var argv = ['you@email.com', 'you@email.com, me@email.com', 'body text'];
    var cli = new Cli().parse(argv);

    cli.errors.should.have.length(1);
  });
  it('should accept multiple "to" addresses', function() {
    var argv = ['you@email.com, me@email.com', 'me@email.com', 'body text'];
    var cli = new Cli().parse(argv);

    cli.errors.should.have.length(0);
  });
  it('should accept multiple cc and bcc addresses', function() {
    var argv = ['--cc', 'you@email.com', '--cc', 'me@email.com',
      '--bcc', 'you@email.com', '--bcc', 'me@email.com'];

    var cli = new Cli().parse(argv);
    cli.parsedOptions.cc.should.have.length(2);
    cli.parsedOptions.bcc.should.have.length(2);
  });
  it('should error when no subject or body are set', function() {
    var argv = ['you@email.com', 'me@email.com'];
    var cli = new Cli().parse(argv);
    
    cli.errors.should.have.length(1);
  });
  it('should allow missing body when subject is set', function() {
    var argv = ['-j', 'a subject', 'you@email.com', 'me@email.com'];
    var cli = new Cli().parse(argv);

    cli.errors.should.have.length(0);
  });
  it('should call a synchronous callback containing options and messages', function() {
    var argv = ['you@email.com', 'me@email.com'];
    var cli = new Cli().parse(argv, function(err, message, options) {
      err.should.have.length(1);
      options.to.should.equal('you@email.com');
      options.from.should.equal('me@email.com');
    });
  });
  it('should return help when requested', function() {
    var argv = ['--help'];
    var cli = new Cli().parse(argv, function(err, message, options) {
      message.should.be.type('string');
    });
  });
  it('should return version when requested', function() {
    var argv = ['--version'];
    var cli = new Cli().parse(argv, function(err, message, options) {
      message.should.be.type('string');
      var pkg = require('../package.json');
      var nodemailerPkg = require('nodemailer/package.json');
      message.should.equal("version " + pkg.version + ", nodemailer: " + nodemailerPkg.version)
    });
  });
});
