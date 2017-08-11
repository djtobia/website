var express = require('express');
var contactRouter = express.Router();
var NodeMailer = require('nodemailer');
var xoauth2 = require('xoauth2');
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


    recaptcha.checkResponse(req.body.captcha, function (err, response) {
        if (err) {
            console.log(err);
            res.send({'success': false});
        }

        if (response.success) {
            human = true;
            console.log("passed captcha");
            res.send({'success': true});
        }
        else {
            res.send({'success': false});
        }
    });

});

contactRouter.route('/sendEmail').post(function (req, res) {

    console.log('creating transport');
    var transporter = NodeMailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'djtobia@gmail.com',
            clientID: '166590923492-hr52cocstkriatem33mhqcoftdhk727g.apps.googleusercontent.com',
            clientSecret: 'YBWm7scLk7qTyfWEXfldx58R',
            refreshToken: '1/E7oHbHPThs7oKhS2g4xZoFU4JzCi-7VLhmRPg76KAIk'
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

    transporter.sendMail(mailOptions, function (err, res) {
        if (err) {
            console.log(err);
            res.send({'emailSent': false});
        } else {
            console.log('mail sent');
        }
    });
    transporter.close();
    console.log('transporter closed');

    res.send({'emailSent': true});

})
;

module.exports = contactRouter;