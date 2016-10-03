'use strict';

var nodemailer = require('nodemailer');
var isemail = require('isemail');

var mailer = function(options, transport) {
  if (!options) {
    options = {};
  }
  options.server = options.server || process.env.SMTP_SERVER;
  options.port = options.port || process.env.SMTP_PORT;
  options.username = options.username || process.env.SMTP_USERNAME;
  options.password = options.password || process.env.SMTP_PASSWORD;
  options.useSSL = options.useSSL || process.env.SMTP_USE_SSL;
  options.useTLS = options.useTLS || process.enc.SMTP_USE_TLS;
  options.service = options.service || process.env.SMTP_SERVICE_NAME || null;

  this.options = options;
  this.data = null;

  // load default transport if none given
  if (!transport) {
    transport = require('nodemailer-smtp-transport');
  }

  if (this.options.service) {
    this.transport = nodemailer.createTransport(transport({
      service: this.options.service,
      auth: {
        user: this.options.username,
        pass: this.options.password
      }
    }));
  }
  else {
    var params = {
      host: this.options.server,
      port: this.options.port
    }
    //Don't pass undefined to smtp transport as it breaks nodemailer for a relay that doesn't require auth
    if (this.options.username != undefined && this.options.password != undefined) {
      params['auth'] = {
        user: this.options.username,
        pass: this.options.password
      };
    }
    params['secure'] = true && this.options.useSSL;
    if (this.options.useTLS) {
      params['ignoreTLS'] = false;
      params['requireTLS'] = true;
    } else {
      params['ignoreTLS'] = true;
      params['requireTLS'] = false;
    }
    if (this.options.ignorecert) {
      params['tls'] = {rejectUnauthorized : false};
    }
    this.transport = nodemailer.createTransport(transport(params));
  }

  return this;
};

mailer.prototype.buildMessage = function(options) {
  // build the mail data object
  this.data = {
    from: options.from,
    to: options.to,
    cc: options.cc,
    bcc: options.bcc,
    replyTo: options.replyTo,
    subject: options.subject,
    text: options.body ? { path: options.body } : options.bodyText,
    attachments: Array.isArray(options.attachment) ? options.attachment.map(function (attachment) { return { path: attachment }; }) : (options.attachment ? { path: options.attachment } : null)
  };

  return this;
};

mailer.prototype.sendMail = function(next) {
  if (!this.data) {
    process.nextTick(function() {
      next(new Error('There was no data to send.'));
    });
  }
  else {
    this.transport.sendMail(this.data, next);
  }
};

module.exports = mailer;

