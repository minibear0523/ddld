var schedule = require('node-schedule');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransporter('');
var Newsletters = require('../models/newsletter');
