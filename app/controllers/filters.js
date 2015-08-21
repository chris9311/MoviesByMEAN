var User = require('../models/user');

exports.signinFilter = function(req,res,next){
    var user = req.session.user;

    if(!user){
       return res.redirect('/');
    }
    next();
};

exports.userRoleFilter = function(req,res,next){
    var user = req.session.user;
    console.log("user.role:"+user.role);
    if(user.role < 10 || !user.role)
    {
        return res.redirect('/');
    }
    next();
};

exports.filters ={

    pagination:function(page,pagesize,json,cb){
        console.log("init");
        var current = page * pagesize;
        var items = json || [];
        var totallist = items.length;
        items = items.slice(current,current+pagesize);
        var totalPages = Math.ceil(totallist / pagesize);
        cb({
            items : items,
            //totallist :totallist,
            totalPages:totalPages
        });
    }
};
