#!/usr/bin/env node

var fs = require('fs');
var chalk = require('chalk');
var error = chalk.bold.red;
var Cli = require('../lib/cli.js');

var cli = new Cli().parse(process.argv.slice(2), function(err, message, options) {
  if (err) {
    console.error(error('\nYou had errors in your syntax. Use --help for further information.'));
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

    mailer.buildMessage(options).sendMail(function(err, result) {
      if (err) {
        console.error(err);
      }
      else {
        console.log("Sent successfully: " + result.response);
      }
    });
  }

});
