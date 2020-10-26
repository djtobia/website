var express = require('express');
var router = express.Router();
const fs = require('fs');

router.route('/')
    .get(function (req, res) {

        fs.readFile('./projects.json', 'utf8', (err, jsonString) => {
            if(err){
                console.log('ya fucked it dylan');
                return;
            }
            jsonProjects = JSON.parse(jsonString);
            let projects = [];
            let images = [];
            for(const [index,project] of Object.entries(jsonProjects)) {
                projects.push(project);
                if(images.length < 3){
                    images.push(project.fileName ? `<img class="projectImage" src="/images/${project.fileName} />` : '<div class="imageBuffer"></div>');
                }
            }
            res.render('projects', {projects: projects});
        });

    });

router.route('/:id')
    .get(function (req, res) {
        var id = req.params.id
        //fetch the json, then parse it, and find id with $oid that matches
        fs.readFile('./projects.json', 'utf8', (err, jsonString) => {
            if (err) {
                console.log('ya fucked it dylan');
                return;
            }
            jsonProjects = JSON.parse(jsonString);

            for (const [index, project] of Object.entries(jsonProjects)) {
                if(project.id === id) {
                    res.render('projectView', {project: project});
                }
            }
        });
    });

module.exports = router;