var isemail = require('isemail');

var validateEmails = function(name, allowMultiple, email) {
  var emails = null;

  // split emails that are comma separated
  if (email.indexOf(',') > 0) {
    if (!allowMultiple) {
      return name + " contained multiple email addresses, when only one is allowed.";
    }
    emails = email.replace(' ', '').split(',');
  }
  // if we aren't an array, we've got a single email that we'll put into an array
  else if (!Array.isArray(email)) {
    emails = [ email ];
  }
  // otherwise, we are an array already
  else {
    emails = email;
  }

  // loop the array of emails, and see if each is valid
  for (var i = 0; i < emails.length; i++) {
    var result = isemail(emails[i]);
    if (!result) {
      return name + " contained an invalid email address: " + emails[i];
    }  
  }
};

module.exports = {
  validateEmails: validateEmails
}
