'use strict';

var fs = require('fs');
var utils = require('./utils');
var validateEmails = utils.validateEmails;
var parseArgs = require('minimist');

var cli = function(argv) {
  this.argv = argv;
  this.options = {
    alias: {
      service: 't',
      username: 'u',
      password: 'p',
      port: 'r',
      nossl: 'n',
      subject: 'j',
      version: 'v',
      help: 'h'
    }
  };

  this.errors = [];
  this.message = null;

  this.helpMessage = [
    "",
    "Usage: nodemailer <to> <from> [bodyText] [options]",
    "",
    "to           Email address, or comma separated list of email addresses to send mail to.",
    "from         Email address that the message should be from.",
    "bodyText     The plaintext message body.",
    "",
    "Options:",
    "   -t, --service    The nodemailer service identifier, if any.",
    "   -u, --username   The SMTP username to use when authenticating.  [local_user_name]",
    "   -p, --password   The plain-text password to use when authenticating.",
    "   -s, --server     The SMTP server that mail will be delivered to.",
    "   -r, --port       The port to use when contacting the SMTP server.",
    "   -n, --nossl      If set, SSL will not be used when sending mail.",
    "   -j, --subject    The string to be used as the email's subject.",
    "   --cc             An email address to Carbon Copy. List multiple recipients by appending multiple --cc parameters.",
    "   --bcc            An email address to Blind Carbon Copy. List multiple recipients by appending multiple -bcc parameters.",
    "   --replyTo        An email address that should receive replies if a recipient replies to your message.",
    "   --body           A file to use as the message body.",
    "   --attachment     A path to a file that should be attached. List multiple attachments by appending multiple --attachment parameters.",
    "   -v, --version    Print version and exit."
  ];

  return this;
};

cli.prototype.parse = function(argv, next) {
  var options = parseArgs(argv, this.options);

  if (options.version) {
    var pkg = require('../package.json');
    var nodemailerPkg = require('nodemailer/package.json');
    this.message = "version " + pkg.version + ", nodemailer: " + nodemailerPkg.version;
  }
  else if (options.help) {
    this.message = this.helpMessage.join('\n');
  }
  else {
    // we have a "no ssl" flag, so we need to invert it
    options.useSSL = options.nossl ? false : true;

    // we want to use sensible names for positional arguments below
    options.to = options._[0];
    options.from = options._[1];
    options.bodyText = options._[2];

    /*
     * Options are processed in a significant order; we only save the last error
     * message, so we'll want to make sure the most significant are last
     */

    // ensure that bcc, cc, and to are valid emails, multiple allowed
    ['bcc', 'cc', 'to', 'from'].forEach(function(i) {
      if(options[i]) {
        var invalid = validateEmails(i, (i === 'from' ? false : true), options[i]);
        if (invalid) {
          this.errors.push(new Error(invalid));
        }
      }
    }.bind(this));

    // you must have at least a subject or a body
    if (!options.subject && !(options.body || options.bodyText)) {
      this.errors.push(new Error("You must have at least a subject or a message body."));
    }

    // now, we fail if we don't have at least a two and a from address
    if (!options.to && !options.from) {
      this.errors.push(new Error('You need to have a "to" and "from" email address.'));
    }
  }
  
  this.options = options;
  
  if (typeof next === 'function') {
    // we return the array of errors if there are any, otherwise null
    next(this.errors.length > 1 ? this.errors : null, this.message, options);
  }

  return this;
};


module.exports = cli;
