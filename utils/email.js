var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransporter('');

var mailOptions = {
  from: '"大道隆达" <>',
  subject: 'Newsletter #Test',
  text: 'Test',
  html: '<b>Test</b>'
};


