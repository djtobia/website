var express = require('express');
var adminRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var fs = require('fs');

var url = 'mongodb://djtobia:travian123@ds161041.mlab.com:61041/website';
adminRouter.route('/addProject')
    .get(function (req, res) {
        if (!req.user) {
            res.render('login');
        }
        else {
            res.render('insertProject');
        }
    })
    .post(function (req, res) {
        console.log(req.body);
        mongodb.connect(url, function (err, db) {
            var collection = db.collection('projects');
            collection.insertOne(req.body.project, function (err, results) {
                res.render('updatedProjects', {project: req.body.project});
                db.close();
            });
        });

    });

adminRouter.route('/')
    .get(function (req, res) {
        if (!req.user) {
            res.render('login');
        }
        else {
            res.render('utilities');
        }
    });

adminRouter.route('/updateResume').post(function (req, res){
    var data = fs.readFileSync('/resume/DylanTobiaResume.pdf');

    mongodb.connect(url, function(err,db){
        var collection = db.collection('resume');
        collection.insertOne({file: data}, function(err, resulst) {
            res.render('updatedResume');
            db.close();
        });
   });
});


module.exports = adminRouter;


