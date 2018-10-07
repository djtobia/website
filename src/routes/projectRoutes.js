var express = require('express');
var mongodb = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var router = express.Router();


router.route('/')
    .get(function (req, res) {
        var url = REDACTED;
        mongodb.connect(url, function (err, db) {
            var collection = db.collection('projects');

            collection.find({}).toArray(function (err, results) {
                res.render('projects',{projects: results});
            });
        });
    });

router.route('/:id')
    .get(function (req, res) {
        var id = new ObjectId(req.params.id);
        var url = REDACTED;
        mongodb.connect(url, function (err, db) {
            var collection = db.collection('projects');

            collection.findOne({_id : id},function (err, results) {
                if(results.name == "Pixel Sorter") {
                    res.render('pixelSorterView', {project: results});
                }else
                res.render('projectView',{project: results});
            });
        });
    });

module.exports = router;
