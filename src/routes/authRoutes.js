var express = require('express');
var authRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var passport = require('passport');

authRouter.route('/login')
    .post(function (req, res, next) {
        passport.authenticate('local',
            function (err, user, info) {
                if (err) {
                    return res.send({success: "false", message: info.message});
                }
                if (!user) {
                    return res.send({success: "false", message: info.message});
                }

                req.logIn(user, function (err) {
                    if (err) {
                        return next(err);
                    }
                    return res.send({success: 'true'});
                });
            }
        )(req, res, next);
    }).get(function (req, res) {
    if (!req.user)
        res.render('login');
    else
        res.render('logout');
});

authRouter.route('/').get(function(req,res){
    if(!req.user)
        res.render('login');
    else
        res.render('logout');
})

authRouter.route('/logout').post(function (req, res) {
    req.logout();
    res.redirect('/login');
}).get(function (req, res) {
    if (req.user)
        res.render('logout');
    else
        res.render('login');
})

module.exports = authRouter;