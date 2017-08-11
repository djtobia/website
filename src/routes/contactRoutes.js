var express = require('express');
var contactRouter = express.Router();
var https = require('https');
var NodeMailer = require('nodemailer');
var xoauth2 = requrie('xoauth2');
var smtpTransport = require('nodemailer-smtp-transport');

contactRouter.route('/').get(function (req, res) {
    res.render('contact');
});

contactRouter.route('/checkCaptcha').post(function (req, res) {
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

    httpsReq.end();

    res.send(human);
});

contactRouter.route('/sendEmail').post(function(req,res){

        console.log("creating transport");
         var transporter = NodeMailer.createTransport({
             service: 'gmail',
             auth: {
                 xoauth2: xoauth2.createXOAuth2Generator({
                     user: 'djtobia@gmail.com',
                     clientID: '166590923492-hr52cocstkriatem33mhqcoftdhk727g.apps.googleusercontent.com',
                     clientSecret: 'YBWm7scLk7qTyfWEXfldx58R',
                     refreshToken: '1/6q2-PjSm0jj4-fFGD6DdgJFGIQ8oZhm2HqdL7X-eFFg'
                 })
             }
         });

         var mailOptions = {
             from: req.body.contact.name + ' <'+req.body.contact.email +'>',
             to: 'djtobia@gmail.com',
             subject: 'CONTACT FROM ' + req.body.contact.name + ' <' + req.body.contact.email + '>' + ' DYLANTOBIA.COM',
             text: req.body.contact.content
         };
        

        console.log("transporter created");
        console.log("transporter sending mail");

        transporter.sendMail(mailOptions,function(err, res){
            if(err){
                console.log(err);
            }else {

                console.log("mail sent");
            }
        });
        transporter.close();
        console.log("transporter closed");

        res.send(true);

});

module.exports = contactRouter;