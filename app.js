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
var authRouter = require('./src/routes/authRoutes');
var extrasRouter = require('./src/routes/extrasRoutes');
var pixelSorterRouter = require('./src/routes/PixelSorterRoutes');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('cookie-session');
var fs = require('fs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({secret: 'djtobia'}));
require('./src/config/passport')(app);
app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});
app.set('views', './src/views');
app.set('images', './src/views/images');
app.set('view engine', 'ejs');

var port = process.env.PORT || 5000;
app.listen(port, function (err) {
    console.log('Running server on port: ' + port);
});


app.use('/projects', projectRouter);
app.use('/admin', adminRouter);
app.use('/contact', contactRouter);
app.use('/auth', authRouter);
app.use('/extras', extrasRouter);
app.use('/pixelSorter', pixelSorterRouter);
app.get('/', function (req, res) {

    let images = [];
    // mongodb.connect(url, function (err, db) {
    //     var collection = db.collection('projects');
    fs.readFile('./projects.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log('ya fucked it dylan');
            return;
        }
        jsonProjects = JSON.parse(jsonString);
        let projects = [];
        let images = [];
        for (const [index, project] of Object.entries(jsonProjects)) {
            projects.push(project);
            if(images.length < 3){
                images.push(project.fileName ? `<img class="projectImage" src="/images/${project.fileName}" />` : '<div class="imageBuffer"></div>');
            }
        }
        res.render('index', {projects: projects, images: images});
    });




        // } (err, results) {
        //     var images = [results[0].fileName ? '<img class="projectImage" src="/images/' + results[0].fileName + '" />' : '<div class="imageBuffer"></div>',
        //         results[1].fileName ? '<img class="projectImage" src="/images/' + results[1].fileName + '" />' : '<div class="imageBuffer"></div>',
        //         results[2].fileName ? '<img class="projectImage" src="/images/' + results[2].fileName + '" />' : '<div class="imageBuffer"></div>'];
        //
        //
        //     res.render('index', {projects: results, images: images});
        // });
    });
// });


app.get('/accessDenied', function (req, res) {
    res.render('accessDenied');
});


app.get('/about', function (req, res) {
    res.render('about');
});

app.get('*', function (req, res) {
    res.render('error');
});

//module.exports = child;
