var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var _ = require('underscore');

router.post('/save',function(req,res){
    var _comment = req.body;
    var movieid = _comment.movie;

    console.log(_comment);

    if(_comment.cid != '' ) {
        console.log("reply");
        Comment.findById(_comment.cid,function(err,comment){
           if(err)
               return console.log(err);
            var reply = {
                from : _comment.from,
                to:_comment.tid,
                content:_comment.content
            };

            comment.reply.push(reply);

            comment.save(function(err,comment){
                if(err){
                    console.log(err);
                    res.json({
                        success:false,
                        err:err
                    });
                }
                else {
                    res.json({
                        success: true
                        //movieid: movieid
                    });
                }
            });
        });
    }
    else {
        console.log("comment");
        var comment = new Comment(_comment);
        comment.save(function(err,comment){
            if(err){
                console.log(err);
                res.json({
                    success:false,
                    err:err
                });
            }
            else {
                res.json({
                    success: true
                    //movieid: movieid
                });
            }
        });
    }


});

router.get('/delete',function(req,res){
    var id = req.query.id;
    console.log("deleting ", id);
    if(id){
        Movie.remove({_id:id}, function(err,movie){
            if(err){
                console.log(err)
            } else {
                res.json({success: 1})
            }
        })
    }
});

router.get('/comments',function(req,res){

    var movieid = req.query.movieid;
    console.log("seach ", movieid);
    Comment.find({movie:movieid})
        .populate('from','name')
        .populate('reply.from reply.to','name')
        .sort("meta.createAt")
        .exec(function(err,comments){
            if(err)
                return console.log(err);
            res.json({
                success:true,
                comments:comments
            });
        });
});

module.exports = router;
