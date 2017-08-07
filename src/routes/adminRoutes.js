var express = require('express');
var adminRouter = express.Router();
var mongodb = require('mongodb').MongoClient;


adminRouter.route('/addProject')
    .get(function (req, res) {
        res.render('insertProject');
    })
    .post(function (req, res) {
        var url = 'mongodb://djtobia:travian123@ds161041.mlab.com:61041/website';
        console.log(req.body);
        mongodb.connect(url, function (err, db) {
            var collection = db.collection('projects');
            collection.insertOne(req.body.project, function (err, results) {
                res.send(results);
                db.close();
            });
       });

    });


module.exports = adminRouter;


