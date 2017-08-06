var express = require('express');
var mongodb = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var router = express.Router();


router.route('/')
    .get(function (req, res) {
        var url = 'mongodb://localhost:27017/website';
        mongodb.connect(url, function (err, db) {
            var collection = db.collection('projects');

            collection.find({}).toArray(function (err, results) {
                res.render('projects',{projects: results});
            });
        });
    });

router.route('/:id')
    .get(function (req, res) {
        var id = new objectId(req.params.id);
        var url = 'mongodb://localhost:27017/website';
        mongodb.connect(url, function (err, db) {
            var collection = db.collection('projects');

            collection.findOne({_id : id},function (err, results) {
                res.render('projectView',{project: results});
            });
        });
    });

module.exports = router;