'use strict';

var nodemailer = require('nodemailer');

var mailer = function(options) {
  if (!options) options = {};
  options.server = options.server || process.env.SMTP_SERVER;
  options.port = options.port || process.env.SMTP_PORT;
  options.username = options.username || process.env.SMTP_USERNAME;
  options.password = options.password || process.env.SMTP_PASSWORD;
  options.useSSL = options.useSSL || process.env.SMTP_USE_SSL;
  options.service = options.service || process.env.SMTP_SERVICE_NAME || null;

  this.options = options;

  if (this.options.service) {
    this.transport = nodemailer.createTransport({
      service: this.options.service,
      auth: {
        user: this.options.username,
        pass: this.options.password
      }
    });
  }
  else {
    this.transport = nodemailer.createTransport({
      host: this.options.server,
      port: this.options.port,
      auth: {
        user: this.options.username,
        pass: this.options.password
      }
    });
  }

  return this;
};

mailer.prototype.sendMail = function(data, next) {
  this.transport.sendMail(data, next);
};

module.exports = mailer;
