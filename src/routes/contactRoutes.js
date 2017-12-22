var express = require('express');
var contactRouter = express.Router();
var NodeMailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

contactRouter.route('/').get(function (req, res) {
    res.render('contact');
});

contactRouter.route('/sendEmail').post(function (req, res) {

    emailjs.send("gmail","template",{reply_to: req.body.contact.email, from_name: req.body.contact.name, message: req.body.contact.content}).then(function(resposne){
        console.log("Email Sent");
    }, function(err){
        console.log(err);
        console.log("Email Failed");
    });
    // console.log('creating transport');
    // var transporter = NodeMailer.createTransport(smtpTransport({
    //     service: 'Gmail',
    //     auth: {
    //             user: 'myactualuser@gmail.com',
    //             pass: 'password'
    //
    //         }
    //
    // }));
    //
    // var mailOptions = {
    //     from: req.body.contact.name + ' <' + req.body.contact.email + '>',
    //     to: 'djtobia@gmail.com',
    //     subject: 'CONTACT FROM ' + req.body.contact.name + ' <' + req.body.contact.email + '>' + ' DYLANTOBIA.COM',
    //     text: req.body.contact.content + ' ' + 'From: ' + req.body.contact.email
    // };
    //
    //
    // console.log('transporter created');
    // console.log('transporter sending mail');
    //
    // transporter.sendMail(mailOptions, function (err, info) {
    //
    //     if (err) {
    //         console.log(err);
    //         console.log('transporter failed');
    //     } else {
    //         console.log('mail sent');
    //
    //     }
    // });
    // transporter.close();
    // console.log('transporter closed');

    res.send({'emailSent': true});

})
;

module.exports = contactRouter;