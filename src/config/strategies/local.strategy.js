var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongodb = require('mongodb').MongoClient;


module.exports = function () {
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
        function (username, password, done) {

            var url = REDACTED;
            mongodb.connect(url, function (err, db) {
                var collection = db.collection('users');
                collection.findOne({username: username},
                    function (err, results) {

                        if(err){
                            return done(err);
                        }

                        if(!results){
                            return done(null, false, {message: 'Username not found.'});
                        }

                        var user = results;
                        if (user.password !== password) {
                            return done(null, false, {message: 'Invalid Password'});
                        }

                        return done(null, user);
                    });
            });
        }));
};
