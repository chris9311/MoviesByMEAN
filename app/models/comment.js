/**
 * Created by HUANGCH4 on 2015/8/14.
 */
var mongoose = require('mongoose');
var CommentSchema = require('../schemas/comment');
var Comment = mongoose.model('Comment',CommentSchema);

module.exports = Comment;