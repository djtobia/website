var express = require('express');
var contactRouter = express.Router();
var NodeMailer = require('nodemailer');
var RecaptchaVerify = require('recaptcha-verify');

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
    var transporter = NodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'djtobia@gmail.com',
            pass: 'KingsCross1025'
        }
    });

    var mailOptions = {
        from: req.body.contact.name + ' <' + req.body.contact.email + '>',
        to: 'djtobia@gmail.com',
        subject: 'CONTACT FROM ' + req.body.contact.name + ' <' + req.body.contact.email + '>' + ' DYLANTOBIA.COM',
        text: req.body.contact.content
    };


    console.log('transporter created');
    console.log('transporter sending mail');
    var emailSent = false;
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log('mail sent');
            emailSent = true;
        }
    });
    transporter.close();
    console.log('transporter closed');

    res.send({'emailSent': emailSent});

})
;

module.exports = contactRouter;