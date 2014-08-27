# nodemailer-cli 0.1.1

A command line interface for sending email, wrapped around [nodemailer][nodemailer]. 

This module is not yet for public consumption: it was quickly assembled so I could easily send email from PresSTORE, and its interface mimics those requirements.

## Installation

Install the module globally to expose the `nodemailer` command to your environment.

```bash
npm install -g nodemailer-cli
```

## Usage

```
$ nodemailer --help

Usage: nodemailer <to> <from> [bodyText] [options]

to           Email address to send the mail to.
from         Email address that the message should be from.
bodyText     The plaintext message body.

Options:
   -t, --service    The nodemailer service identifier, if any.
   -u, --username   The SMTP username to use when authenticating.  [local_user_name]
   -p, --password   The plain-text password to use when authenticating.
   -s, --server     The SMTP server that mail will be delivered to.
   -r, --port       The port to use when contacting the SMTP server.  [465]
   -n, --nossl      If set, SSL will not be used when sending mail.
   -j, --subject    The string to be used as the email's subject.
   --body           A file to use as the message body.
   --attachment     A path to a file that should be attached. List multiple attachments by appending multiple --attachment parameters.
   --version        print version and exit
```

## Environment Variables

Some environment variables can be used in place of CLI options. CLI options override these environment variables, if used, so these can be thought of as defaults.

- **SMTP_SERVER** The hostname of the SMTP server to be used.
- **SMTP_PORT** The port on the SMTP server that should be connected to.
- **SMTP_USERNAME** The username to use when authenticating.
- **SMTP_PASSWORD** The password to use when authenticating.
- **SMTP_USE_SSL** Set this to a truth-y value to use SSL.
- **SMTP_SERVICE_NAME** This is one of nodemailer's service identifiers, if you want it to configure itself automatically.


## History

- **v0.1.1**  
Adds flag to print version of cli and nodemailer.

- **v0.1.0**  
Cleans up command line switches, and adds support for attachments.

- **v0.0.1**  
Initial Release.



[nodemailer]: https://github.com/andris9/Nodemailer

## The MIT License (MIT)

Copyright (c) 2014 Nathan Wittstock

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
