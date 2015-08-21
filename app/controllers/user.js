var express = require('express');
var router = express.Router();
var User = require('../models/user');
var filter = require('./filters');

router.get('/check', function (req,res) {
    if(req.session.user){
        res.json({user:req.session.user})
    }
    else{
        res.json(false);
    }
});

router.post('/signup',function(req,res){
    console.log('signup');
    var _user = req.body.user;
    console.log(_user);

    User.find({name:_user.name},function(err,user){
        if(err){
            return console.log(err);
        }
        if(!user){
            return res.json({success:false});
        }

        var user = new User(_user);
        user.save(function(err,user){
            if(err)
                console.log(err);
            //console.log(user);
            req.session.user = user;
            return res.json({success:true});

        });

    });

});


router.get('/list',filter.signinFilter,filter.userRoleFilter,function (req, res) {

    User.fetch(function(err,users){
        if(err){
            console.log(err)
        }
        res.json({
            title: '用户列表页',
            users:users
        });
    })

});

router.post('/signin',function(req,res){
    var _user = req.body;
    console.log(_user);
    var name = _user.name;
    var password = _user.password;

    User.findOne({name:name}, function (err,user) {
        if(err)
            console.log(err);
        if(!user)
            return res.json({success:false});

        user.comparePassword(password,function(err,isMatch){
            if(err)
                console.log(err);
            if(isMatch){
                req.session.user = user;
                console.log("success,"+isMatch);
                return res.json({success:true});
            }
            else{
                console.log("error,"+isMatch);
                return res.json({success:false});
            }
        });
    });
});

router.get('/logout',function(req,res){
    delete req.session.user;
    //delete app.locals.user;
    res.redirect('/');
});

module.exports = router;
