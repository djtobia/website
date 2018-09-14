/**
 * Created by Dylan on 9/13/2018.
 */
var express = require('express');
var pixelSorterRouter = express.Router();
var multer = require('multer');
var exec = require('child_process').exec;
var fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./uploads");
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    },

});
var upload = multer({
    storage: storage
}).single('image');

//var child = exec('java -jar D:/Dylan/Documents/PixelSorter/out/artifacts/PixelSorter_jar/PixelSorter.jar C:/Users/Dylan/Desktop/excellent.bmp',
//     function(error,stdout,stderr){
//         console.log("Ran program");
//         if(error != null){
//             console.log("THere was an error " + error);
//         }
// });
pixelSorterRouter.route('/')
    .get(function (req, res) {
            res.render('pixelSorter');

    });

pixelSorterRouter.route('/upload').post(function(req,res,next) {
    if(req.file == null){
       return res.render("mustUploadFile");
    }
    console.log("posted to /upload");
    upload(req, res, function (err) {
        if (err) {
            return res.end("There was a problem uploading your file");
        }

    console.log(req.file.originalname + " has been uploaded");
        exec('java -jar public/jars/PixelSorter.jar uploads/' + req.file.originalname,
            function (error, stdout, stderr) {
                console.log("Ran Program");
                if (error != null) {
                    console.log(error);
                }

                var options = {
                    root: "uploads/",
                    dotfiles: 'deny',
                    headers: {
                        'x-timestamp': Date.now(),
                        'x-sent': true
                    }
                };
                 var filenames = getFileNames(req.file.originalname);

                if(req.body.sortType == "gradient"){
                res.sendFile(filenames[0],options, function(err){
                    if(err){
                        console.log("There was a problem sending you file " + filenames[0]);
                    }
                    deleteFiles(filenames);
                });}
                else {
                    res.sendFile(filenames[1], options, function (err) {
                        if (err) {
                            console.log("There was a problem sending you file " + filenames[1]);
                        }
                        deleteFiles(filenames);
                    })
                }

            });


    });

});
function deleteFiles(filenames){
    filenames.forEach(function(name){
        fs.unlink('uploads/'+name, function(err){
            if(err){
                console.log(err);
            }
        })
    }
    );
};
function getFileNames(originalname){
    var names = [];

    var length = originalname.length;
    var sub = originalname.substring(0,length-4);

    names.push(sub+"GradientSorted.jpg");
    names.push(sub+"Sorted.jpg");
    names.push(originalname);
    console.log(names);
    return names;
}






module.exports = pixelSorterRouter;


