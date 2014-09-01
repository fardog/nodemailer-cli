var isemail = require('isemail');

// TODO name should be handled externally

var validateEmails = function(name, allowMultiple, email) {
  var emails = null;

  if (typeof email !== 'string' && !Array.isArray(email)) {
    return name + " expects a value.";
  }
  // split emails that are comma separated
  else if (email.indexOf(',') > 0 && allowMultiple) {
    
    emails = email.replace(/\s+/g, '').split(',');
  }
  else if ((Array.isArray(email) || email.indexOf(',') > 0) && !allowMultiple) {
    return name + " contained multiple email addresses, when only one is allowed.";
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

  return false;
};

module.exports = {
  validateEmails: validateEmails
}
