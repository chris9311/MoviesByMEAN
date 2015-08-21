var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');

router.get('/', function (req, res) {
    res.render('layout', {
        title: '首页',
    });
});

//router.get('/', function (req, res) {
//    //console.log(req.session.user);
//    Movie.fetch(function(err,movies){
//        if(err){
//            console.log(err)
//        }
//        res.render('index',{
//            title: 'imoooc 首页',
//            movies: movies,
//        });
//    })
//});

module.exports = router;