var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');
var Category = require('../models/category');
var _ = require('underscore');
var filter = require('./filters');

router.get('/', function (req, res) {
    //console.log(req.session.user);
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err)
        }
        res.json({
            title: '首页',
            movies: movies
        });
    })
});

router.get('/list/:pagesize/:page', function (req, res) {

    var page = parseInt(req.params.page,10)-1;
    var count = parseInt(req.params.pagesize,10);


    Movie.fetch(function(err,movies){
        if(err){
            return console.log(err)
        }

        //var current = page * count;
        //var movies = movies || [];
        //var totalMovies = movies.length;
        //console.log(totalMovies);
        //movies = movies.slice(current,current+count);
        //var totalPages = Math.ceil(totalMovies / count);

        //var json = "";
        filter.filters.pagination(page,count,movies,function(data){
            res.json( {
                title: '电影列表' ,
                movies:data.items,
                totalPages : data.totalPages,
                currentPage: page+1
            });
        });


    })

});

router.get('/detal/:movieid', function (req, res) {

    var id = req.params.movieid;

    Movie.findById(id,function(err,movie){
        movie.update({$inc:{pv:1}},function(err){
            if(err){
                console.log(err);
            }
        });
        res.json({
            title: movie.title,
            movie: movie
        });
    });
});

router.get('/update/:id',function(req, res){
    var id = req.params.id;
    if(id){
        Movie.findById(id,function(err,movie){
            res.json({
                title:'后台更新页',
                movie:movie
            });
        });
    }
});

//router.get('/new', function (req, res) {
//    res.render('admin', {
//        title: 'imoooc 后台录入页',
//        movie:{
//            title: '',
//            doctor:'',
//            year:'',
//            country:'',
//            language:'',
//            poster: '',
//            flash: '',
//            summary:''
//        }
//    });
//});

router.post('/save',function(req,res){
    var id = req.body._id;
    console.log(id);
    var movieObj = req.body;
    var _movie;

    if(id != undefined ){
        Movie.findById(id,function(err,movie){
            if(err){
                console.log(err)
            }
            _movie = _.extend(movie,movieObj);
            _movie.save(function(err,movie){
                if(err) {
                    console.log(err);
                    return res.json({
                        success: false,
                        err: err
                    });
                }

                var categoryid = _movie.category;
                Category.findOne({"movies":movie._id},function(err,category){
                    category.movies.pull(movie._id);
                    category.save(function (err,category) {
                        if(err){
                            console.log(err);
                            return res.json({
                                success: false,
                                err: err
                            });
                        }
                    })
                });

                Category.findById(categoryid,function(err,category){
                    category.movies.push(movie._id);
                    category.save(function(err,category){
                        if(err)
                            return res.json({
                                success:false,
                                err:err
                            });
                        res.json({
                            success: true,
                            movieid: movie._id
                        });
                    })
                });
                //
                //res.json({
                //success:true,
                //movieid:movie._id
                //});
            })
        })
    }
    else{
        _movie = new Movie(movieObj);

        var categoryid = _movie.category;
        _movie.save(function(err,movie){
            if(err){
                console.log(err);
                return res.json({
                    success:false,
                    err:err
                });
            }
            //Category.fingOne(movies)

            Category.findById(categoryid,function(err,category){
                category.movies.push(movie._id);
                category.save(function(err,category){
                    if(err)
                        return res.json({
                        success:false,
                        err:err
                    });
                    res.json({
                        success: true,
                        movieid: movie._id
                    });
                })
            });
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

router.get('/search/:keyword/:pagesize/:page',function(req,res){

    var page = parseInt(req.params.page,10)-1;
    var pagesize = parseInt(req.params.pagesize,10);

    var keyword = req.params.keyword;
    Movie.findByKey(keyword,function(err,movies){
        if(err)
            return console.log(err);
        //console.log("movies:"+movies.length);

        filter.filters.pagination(page,pagesize,movies,function(data){
            res.json({
                title : '搜索结果',
                movies : data.items,
                totalPages : data.totalPages,
                keyword : keyword,
                currentPage: page+1
            })
        });

    })

});

//router.delete('/list',function(req,res){
//
//    var id = req.query.id;
//    console.log("deleting ", id);
//    if(id){
//        Movie.remove({_id:id}, function(err,movie){
//            if(err){
//                console.log(err)
//            } else {
//                res.json({success: 1})
//            }
//        })
//    }
//});

module.exports = router;
