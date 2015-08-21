var express = require('express');
var router = express.Router();
var Category = require('../models/category');
var _ = require('underscore');
var filter = require('./filters');

router.post('/save',function(req,res){
    var _category = req.body.category;
    console.log(_category);
    var category = new Category(_category);
    category.save(function(err,category){
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

router.get('/movies/:categoryid/:pagesize/:page',function(req,res){
    //console.log("init");
    var page = parseInt(req.params.page,10)-1;
    var count = parseInt(req.params.pagesize,10);
    //var current = page * count;

    var id = req.params.categoryid;
    console.log(id);
    Category.findById(id,function(err,category){
        if(err)
            return console.log(err);

        //var movies = category.movies || [];
        //var totalMovies = movies.length;
        //console.log(totalMovies);
        //movies = movies.slice(current,current+count);
        //var totalPages = Math.ceil(totalMovies / count);
        filter.filters.pagination(page,count,category.movies,function(data){
            res.json({
                success:true,
                movies:data.items,
                title:category.name,
                categoryid:category._id,
                totalPages : data.totalPages,
                currentPage: page+1
            })
        });


    })

});

router.get('/list', function (req,res) {

    Category.find({},{name:1})
        .sort("meta.createAt")
        .exec(function(err,categories){
            if(err){
                return console.log(err);
            }
            res.json({
                success:true,
                categories:categories
            })
        });
});

router.get('/categories',function(req,res){

    //var category = req.query.movieid;
    //console.log("seach ", movieid);
    Category.find()
        .populate('movies')
        .sort("meta.createAt")
        .exec(function(err,categories){
            if(err)
                return console.log(err);
            for(var i=0;i<categories.length ;i++){
                if(categories[i].movies.length>6){
                    categories[i].movies=categories[i].movies.slice(0,6);
                }
            }
            res.json({
                success:true,
                categories:categories,
                title:'首页'
            });
        });
});

module.exports = router;

