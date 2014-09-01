'use strict';

var fs = require('fs');
var utils = require('./utils');
var validateEmails = utils.validateEmails;
var nomnom = require('nomnom');

var cli = function(argv) {
  this.argv = argv;

  return this;
};

cli.prototype.parse = function(argv, next) {
  var options = nomnom
  .script('nodemailer')
  .option('service', {
    abbr: 't',
    help: 'The nodemailer service identifier, if any.'
  })
  .option('username', {
    abbr: 'u',
    default: process.env.USER,
    help: 'The SMTP username to use when authenticating.'
  })
  .option('password', {
    abbr: 'p',
    help: 'The plain-text password to use when authenticating.'
  })
  .option('server', {
    abbr: 's',
    help: 'The SMTP server that mail will be delivered to.'
  })
  .option('port', {
    abbr: 'r',
    default: process.env.SMTP_PORT || 465,
    help: 'The port to use when contacting the SMTP server.'
  })
  .option('nossl', {
    abbr: 'n',
    flag: true,
    help: 'If set, SSL will not be used when sending mail.'
  })
  .option('subject', {
    abbr: 'j',
    help: 'The string to be used as the email\'s subject.'
  })
  .option('cc', {
    help: 'An email address to Carbon Copy. List multiple recipients by appending multiple --cc parameters.',
    callback: validateEmails.bind(this, 'cc', true),
    list: true
  })
  .option('bcc', {
    help: 'An email address to Blind Carbon Copy. List multiple recipients by appending multiple -bcc parameters.',
    callback: validateEmails.bind(this, 'bcc', true),
    list: true
  })
  .option('replyTo', {
    help: 'An email address that should receive replies if a recipient replies to your message.',
    callback: validateEmails.bind(this, 'replyTo', false)
  })
  .option('body', {
    help: "A file to use as the message body."
  })
  .option('attachment', {
    help: 'A path to a file that should be attached. List multiple attachments by appending multiple --attachment parameters.',
    list: true
  })
  .option('to', {
    position: 0,
    required: true,
    help: 'Email address, or comma separated list of email addresses to send mail to.',
    callback: validateEmails.bind(this, 'to', true)
  })
  .option('from', {
    position: 1,
    required: true,
    help: 'Email address that the message should be from.',
    callback: validateEmails.bind(this, 'from', false)
  })
  .option('bodyText', {
    position: 2,
    help: 'The plaintext message body.'
  })
  .option('version', {
    flag: true,
    help: 'print version and exit',
    abbr: 'v',
    callback: function() {
      var pkg = require('../package.json');
      var nodemailerPkg = require('nodemailer/package.json');
      return "version " + pkg.version + ", nodemailer: " + nodemailerPkg.version;
    }
  })
  .parse(argv);

  // we have a "no ssl" flag, so we need to invert it
  options.useSSL = options.nossl ? false : true;

  // nomnom won't allow this sort of logic, so we need to do it after the fact
  if (!options.subject && !(options.body || options.bodyText)) {
    console.error("ERROR: You must have at least a subject or a message body.");
    process.exit(1);
  }

  this.options = options;

  if (typeof next === 'function') {
    next(err, options);
  }

  return this;
};


module.exports = cli;
