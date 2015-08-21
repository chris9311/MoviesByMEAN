/**
 * Created by HUANGCH4 on 2015/7/29.
 */
var mongoose = require('mongoose')
var MovieSchema = require('../schemas/movie')
var Movie = mongoose.model('Movie',MovieSchema)

module.exports = Movie