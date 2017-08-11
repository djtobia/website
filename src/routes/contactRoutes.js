var express = require('express');
var contactRouter = express.Router();
var https = require('https');
var NodeMailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

contactRouter.route('/').get(function (req, res) {
    res.render('contact');
});

contactRouter.route('/sendEmail').post(function (req, res) {
    console.log(req.body);

    var human = false;
    var httpsReq = https.request(' https://www.google.com/recaptcha/api/siteverify?secret=6Lc3hiwUAAAAAPQHLIWD799Jw_unIeVdSIXtQGqf&response=' + req.body.captcha,
        function (httpsRes) {

            var googleResponse = "";
            httpsRes.on("data", function (chunk) {
                googleResponse += chunk;
            });
            console.log("google response");
            console.log(googleResponse);

            httpsRes.on("end", function () {
                human = JSON.parse(googleResponse).success;
            });
            console.log("human : " + human);

        });

    httpsReq.on("error", function (err) {
        console.log("error :");
        console.log(err);
        res.send("Error: " + JSON.stringify(err));
    });

    httpsReq.on('end', function (err) {
        if (human) {
            console.log("creating transport");
            var transporter = NodeMailer.createTransport(smtpTransport({
                service: 'gmail',
                auth: {
                    user: 'djtobia@gmail.com',
                    pass: 'kingscross1025'
                }
            }));
            console.log("transporter created");
            console.log("transporter sending mail");

            transporter.sendMail({
                from: '',
                to: 'djtobia@gmail.com',
                subject: 'CONTACT FROM ' + req.body.contact.name + ' <' + req.body.contact.email + '>' + ' DYLANTOBIA.COM',
                text: req.body.contact.content
            });
            console.log("mail sent");
            transporter.close();
            console.log("transporter closed");
            res.send(true);
        } else {
            console.log("Captcha not checked");
            res.send(false);
        }
    });
});

module.exports = contactRouter;