/**
 * Created by HUANGCH4 on 2015/8/12.
 */
var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var User = mongoose.model('User',UserSchema);

module.exports = User;