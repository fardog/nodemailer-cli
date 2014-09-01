#!/usr/bin/env node

var fs = require('fs');
var Cli = require('../lib/cli.js');
var cli = new Cli().parse(process.argv.slice(2));
var options = cli.options;

var Mailer = require('../lib/mailer');
var mailer = new Mailer(options);

// build the mail data object
var data = {
  from: options.from,
  to: options.to,
  cc: options.cc,
  bcc: options.bcc,
  replyTo: options.replyTo,
  subject: options.subject,
  text: options.body ? { path: options.body } : options.bodyText,
  attachments: options.attachment ? options.attachment.map(function (attachment) { return { path: attachment }; }) : null
};


mailer.sendMail(data, function(err, result) {
  if (err) {
    console.error(err);
  }
  else {
    console.log("Sent successfully: " + result.response);
  }
});
