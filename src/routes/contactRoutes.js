var express = require('express');
var contactRouter = express.Router();
var nodemailer = require('nodemailer');

contactRouter.route('/').get(function (req, res) {
    res.render('contact');
}).post(function (req, res) {
    var transporter = nodemailer.createTransport();
    transporter.sendMail({
        from: req.body.contact.sender,
        to: 'djtobia@gmail.com',
        subject: 'CONTACT FROM ' + req.body.contact.name + ' DYLANTOBIA.COM',
        text: req.body.contact.content
    });
    transporter.close();
});

module.exports = contactRouter;