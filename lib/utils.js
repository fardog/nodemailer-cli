var isemail = require('isemail');

var validateEmails = function(name, allowMultiple, email) {
  var emails = null;

  // split emails 
  if (email.indexOf(',') > 0) {
    if (!allowMultiple) {
      return name + " contained multiple email addresses, when only one is allowed.";
    }
    emails = email.replace(' ', '').split(',');
  }
  else {
    emails = [ email ];
  }
  for (var i = 0; i < emails.length; i++) {
    var result = isemail(emails[i]);
    if (!result) {
      return name + " contained an invalid email address: " + emails[i];
    }  
  }
  
  return false;
};

module.exports = {
  validateEmails: validateEmails
}
