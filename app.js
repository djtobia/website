/**
 * Created by Dylan on 7/27/2017.
 */
var express = require('express');
var mongodb = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var app = express();
var projectRouter = require('./src/routes/projectRoutes');
var adminRouter = require('./src/routes/adminRoutes');
var contactRouter = require('./src/routes/contactRoutes');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.set('views', './src/views');
app.set('images', './src/views/images');
app.set('view engine', 'ejs');

var port = 5000;
app.listen(port, function (err) {
    console.log('Running server on port: ' + port);
});


app.use('/projects', projectRouter);
app.use('/admin', adminRouter);
app.use('/contact', contactRouter);
app.get('/', function (req, res) {
    var url = 'mongodb://localhost:27017/website';
    mongodb.connect(url, function (err, db) {
        var collection = db.collection('projects');

        collection.find({}).toArray(function (err, results) {
            var images = [results[0].fileName ? "<img class='projectImage' src='/images/" + results[0].fileName + "' />" : "<div class='imageBuffer'></div>",
                    results[1].fileName ? "<img class='projectImage' src='/images/" + results[1].fileName + "' />" :"<div class='imageBuffer'></div>",
                results[2].fileName ? "<img class='projectImage' src='/images/" + results[2].fileName + "' />" : "<div class='imageBuffer'></div>"];


            res.render('index', {projects: results, images: images});
        });
    });
});

app.get('/about', function(req,res){
    res.render('about');
});

