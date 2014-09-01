#!/usr/bin/env node

var fs = require('fs');
var colors = require('colors');
var Cli = require('../lib/cli.js');

var cli = new Cli().parse(process.argv.slice(2), function(err, message, options) {
  if (err) {
    console.error('\nYou had errors in your syntax. Use --help for further information.'.red);
    err.forEach(function (e) {
      console.error(e.message);
    });
  }
  else if (message) {
    console.log(message);
  }
  else {

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
  }

});
