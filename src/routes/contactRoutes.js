var express = require('express');
var contactRouter = express.Router();
var NodeMailer = require('nodemailer');
var RecaptchaVerify = require('recaptcha-verify');
var smtpTransport = require('nodemailer-smtp-transport');

contactRouter.route('/').get(function (req, res) {
    res.render('contact');
});

contactRouter.route('/checkCaptcha').post(function (req, res) {

    console.log(req.body);
    var recaptcha = new RecaptchaVerify({
        secret: '6Lc3hiwUAAAAAPQHLIWD799Jw_unIeVdSIXtQGqf',
        verbose: true
    });
    var human = true;

    recaptcha.checkResponse(req.body.captcha, function (err, response) {
        if (err) {
            console.log(err);
            human = false;
        }
        if (human !== false) {
            if (response.success) {
                console.log('passed captcha');
                human = true;
            }
            else {
                human = false;
            }
        }

    });

    res.send({'success': human});
});

contactRouter.route('/sendEmail').post(function (req, res) {

    console.log('creating transport');
    var transporter = NodeMailer.createTransport(smtpTransport({
        service: 'Gmail',
        auth: {
                user: 'dylantobiawebsite@gmail.com',
                pass: 'King\'s Cross 1025!'

            }

    }));

    var mailOptions = {
        from: req.body.contact.name + ' <' + req.body.contact.email + '>',
        to: 'djtobia@gmail.com',
        subject: 'CONTACT FROM ' + req.body.contact.name + ' <' + req.body.contact.email + '>' + ' DYLANTOBIA.COM',
        text: req.body.contact.content + ' ' + 'From: ' + req.body.contact.email
    };


    console.log('transporter created');
    console.log('transporter sending mail');

    transporter.sendMail(mailOptions, function (err, info) {

        if (err) {
            console.log(err);
            console.log('transporter failed');
        } else {
            console.log('mail sent');

        }
    });
    // transporter.close();
    // console.log('transporter closed');

    res.send({'emailSent': true});

})
;

module.exports = contactRouter;