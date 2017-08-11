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
    var httpsReq = https.request(' https://www.google.com/recaptcha/api/siteverify?secret=6Lc3hiwUAAAAAPQHLIWD799Jw_unIeVdSIXtQGqf&response=' + req.body['g-recaptcha-response'],
        function (httpsRes) {
            var googleResponse = "";
            httpsRes.on("data", function (chunk) {
                googleResponse += chunk;
            });

            httpsRes.on("end", function () {
                human = JSON.parse(googleResponse).success;
            });
        });

        httpsReq.on("error", function(err){
            res.send("Error: " + JSON.stringify(err));
        });

        httpsReq.end();

    if (human) {
        var transporter = NodeMailer.createTransport(smtpTransport({
            service: 'gmail',
            auth: {
                user: 'djtobia@gmail.com',
                pass: 'kingscross1025'
            }
        }));
        transporter.sendMail({
            from: '',
            to: 'djtobia@gmail.com',
            subject: 'CONTACT FROM ' + req.body.contact.name + ' <' + req.body.contact.email + '>' + ' DYLANTOBIA.COM',
            text: req.body.contact.content
        });
        transporter.close();
    }else{
        console.log("Captcha not checked");
        res.send({'human' : false});
    }

});

module.exports = contactRouter;