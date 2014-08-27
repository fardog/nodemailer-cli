#!/usr/bin/env node

var fs = require('fs');
var isemail = require('isemail');

var emailBody = null;

var validateEmail = function(name, email) {
  var result = isemail(email);
  if (!result) {
    return "<" + name + "> must be a valid email address.";
  }
  return false;
};

var readEmailBodyFile = function(filename) {
  try {
    emailBody = fs.readFileSync(filename, {encoding: 'utf-8'});
    if (!emailBody) {
      return "The file containing the email body was empty.";
    }
  }
  catch (err) {
    return err.message;
  }
  return false;
};

var options = require('nomnom')
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
  .option('body', {
    help: "A file to use as the message body.",
    callback: readEmailBodyFile
  })
  .option('attachment', {
    help: 'A path to a file that should be attached. List multiple attachments by appending multiple --attachment parameters.',
    list: true
  })
  .option('to', {
    position: 0,
    required: true,
    help: 'Email address to send the mail to.',
    callback: validateEmail.bind(this, 'to')
  })
  .option('from', {
    position: 1,
    required: true,
    help: 'Email address that the message should be from.',
    callback: validateEmail.bind(this, 'from')
  })
  .option('bodyText', {
    position: 2,
    help: 'The plaintext message body.'
  })
  .parse();

// we have a "no ssl" flag, so we need to invert it
options.useSSL = options.nossl ? false : true;

var Relay = require('../lib');
var relay = new Relay(options);

// build the mail data object
var data = {
  from: options.from,
  to: options.to,
  subject: options.subject,
  text: emailBody || options.bodyText,
  attachments: options.attachment ? options.attachment.map(function (attachment) { return { path: attachment }; }) : null
};

// nomnom won't allow this sort of logic, so we need to do it after the fact
if (!options.subject && !data.text) {
  console.error("ERROR: You must have at least a subject or a message body.");
  process.exit(1);
}

relay.sendMail(data, function(err, result) {
  if (err) {
    console.error(err);
  }
  else {
    console.log("Sent successfully: " + result.response);
  }
});
