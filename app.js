var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var port = process.env.PORT || 3000;
var app = express();
var _ = require('underscore');
var logger = require('morgan');
var routes = require('./app/config/routes');
var DB_URL = 'mongodb://localhost:27017/imooc';
var fs = require('fs');
var multipart = require('connect-multiparty');
app.use(multipart());
//new Db(new Server('localhost', 27017), {safe:false});
//var mongodb = new mongoStore(new Server('localhost', 27017), {safe:false});

mongoose.connect(DB_URL);

var models_path = __dirname + '/app/models';

var walk = function(path) {
    fs
        .readdirSync(path)
        .forEach(function(file) {
            var newPath = path + '/' + file;
            var stat = fs.statSync(newPath);

            if (stat.isFile()) {
                if (/(.*)\.(js|coffee)/.test(file)) {
                    require(newPath)
                }
            }
            else if (stat.isDirectory()) {
                walk(newPath)
            }
        })
};
walk(models_path);

app.set('views', './client/views/pages');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname)));


app.listen(port);

console.log('imooc started on port ' + port);

app.use(session({
    secret:'imooc',
    resave : false,
    saveUninitialized: true,
    store:new mongoStore({
        url: DB_URL,
        collection : 'sessions'
    })
}));

var env =  process.env.NODE_ENV || 'development';
if('development' === env){
    app.set('showStackError',true);
    app.use(logger(':method :url :status'));
    app.locals.pretty = true;
    mongoose.set('debug',true);
}

app.use(function (req,res,next) {
    //console.log(req.session.user);
    var _user = req.session.user;
    app.locals.user = _user;

    next();
});

app.use('/',routes);
