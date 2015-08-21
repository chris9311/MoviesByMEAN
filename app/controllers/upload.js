var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');
var Category = require('../models/category');
var _ = require('underscore');
var filter = require('./filters');
var fs = require('fs');
var path = require('path');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.post('/poster',multipartMiddleware,function(req,res){
    var posterData = req.files.file;
    //console.log(req.body);
    //console.log(req);
    //console.log(req.file);
    console.log(posterData);
    var filePath = posterData.path;
    var originalFilename = posterData.originalFilename;
    console.log(originalFilename);

    if(originalFilename){
        fs.readFile(filePath,function(err,data){
            if(err){
                return console.log(err);
            }

            var time = Date.now();
            var type = posterData.type.split('/')[1];
            var poster = time + '.' +type;
            var newPath = path.join(__dirname,'../../','public/upload/poster/' + poster);

            fs.writeFile(newPath,data,function(err){
                if(err){
                    return console.log(err);
                }
                req.poster = poster;

                res.json({
                    poster :'/public/upload/poster/'+poster
                });
            })
        });
    }
});

module.exports = router;
