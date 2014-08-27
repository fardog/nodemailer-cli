#!/usr/bin/env node

// PresSTORE uses <to> <from> <subject> <path_to_file_with_body> so we'll need
//  to support that.

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
  .option('subject', {
    position: 2,
    required: true,
    help: 'The string to be used as the email\'s subject.'
  })
  .option('filename', {
    position: 3,
    required: true,
    help: "Path to the file to be used as the body of the email.",
    callback: readEmailBodyFile
  })
  .parse();

if (options.nossl === true) {
  options.useSSL = false;
}
else {
  options.useSSL = true;
}

var Relay = require('../lib');
var relay = new Relay(options);

var data = {
  from: options.from,
  to: options.to,
  subject: options.subject,
  text: emailBody
};

relay.sendMail(data, function(err, result) {
  if (err) {
    console.error(err)
  }
  else {
    console.log("Sent successfully: " + result.response);
  }
});
