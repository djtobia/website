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
        callback(null, "public/uploads");
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

        console.log("posted to /upload");
        upload(req, res, function (err) {
            console.log(req.file);
            if(req.file == null){
                res.render("mustUploadFile");
                return;
            }

            if (err) {
                return res.end("There was a problem uploading your file");
            }

            console.log(req.file.originalname + " has been uploaded");
            var newFileName = removeSpaces(req.file.originalname);
            fs.rename('public/uploads/'+req.file.originalname,'public/uploads/'+newFileName,function(err){
                if(err)
                    console.log(err);
            });
            console.log('java -jar public/jars/PixelSorter.jar public/uploads/' + newFileName + " " +req.body.sortType);
            exec('java -jar public/jars/PixelSorter.jar public/uploads/' + newFileName + " " +req.body.sortType,
                function (error, stdout, stderr) {
                    console.log("Ran Program");
                    if (error != null) {
                        console.log(error);
                    }

                    var options = {
                        root: "public/uploads/",
                        dotfiles: 'deny',
                        headers: {
                            'x-timestamp': Date.now(),
                            'x-sent': true
                        }
                    };
                    var filenames = getFileNames(newFileName, req.body.sortType);


                        res.sendFile(filenames[0], options, function (err) {
                            if (err) {
                                console.log("There was a problem sending you file " + filenames[0]);
                            }
                            deleteFiles(filenames);
                        });
                   

                });


        });

});

function removeSpaces(fileName) {
    var countSpaces = [];
    for (var i = 0; i < fileName.length; i++) {
        if (fileName.charAt(i) == " ") {
            countSpaces.push(i);
        }
    }

    var txt = "";
    console.log("num spaces  : " + countSpaces.length);
    if (countSpaces.length > 0) {

        for (var i = 0; i < countSpaces.length; i++) {
            txt = fileName.slice(0, countSpaces[i]) + fileName.slice(countSpaces[i] + 1);
        }
        console.log(txt);

        return txt;
    }
else
    return fileName;


}
function deleteFiles(filenames){
    filenames.forEach(function(name){
        fs.unlink('public/uploads/'+name, function(err){
            if(err){
                console.log(err);
            }
        })
    }
    );
};
function getFileNames(originalname, sortType){
    var names = [];

    var length = originalname.length;
    var sub = originalname.substring(0,length-4);
    if(sortType == "gradient")
        names.push(sub+"GradientSorted.jpg");
    else
        names.push(sub+"Sorted.jpg");

    names.push(originalname);
    console.log(names);
    return names;
}






module.exports = pixelSorterRouter;


