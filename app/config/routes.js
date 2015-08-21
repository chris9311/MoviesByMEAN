var express = require('express');
var router = express.Router();

var movie = require('../controllers/movie');
var index = require('../controllers/index');
var user = require('../controllers/user');
var comment = require('../controllers/comment');
var category = require('../controllers/category');
var upload = require('../controllers/upload');

router.use('/',index);
router.use('/user',user);
router.use('/movie',movie);
router.use('/comment',comment);
router.use('/category',category);
router.use('/upload',upload);

module.exports = router;