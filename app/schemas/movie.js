/**
 * Created by HUANGCH4 on 2015/7/29.
 */
var mongooes =  require('mongoose');
var Schema = mongooes.Schema;
var ObjectId = Schema.Types.ObjectId;
var Category = require('./category');

var MovieSchema = new Schema({
    doctor:String,
    title:String,
    language:String,
    country:String,
    summary:String,
    flash:{
        type:String,
        default : "http://player.youku.com/player.php/sid/XNJA1Njc0NTUy/v.swf"
    },
    pv:{
        type:Number,
        default : 0
    },
    poster:String,
    year:Number,
    category : {
        type: ObjectId,
        ref : 'Category'
    },
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
});


MovieSchema.pre('save',function(next){
    //console.info("1.1")
    if(this.isNew){
        //console.info('1.2')
        this.meta.createAt = this.meta.updateAt = Date.now();
        //Category.update({_id:this.category})
    }
    else{
        //console.info('1.3')
        this.meta.updateAt = Date.now();
    }
    //console.info('1.4')
    next();
});

MovieSchema.statics = {
    fetch: function(cb) {
        return this
            .find()
            .populate('category','name')
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById:function(id,cb){
        return this
            .findOne({_id:id})
            .populate('category','name')
            .exec(cb)
    },
    findByKey:function(key,cb){
        var keyword = new RegExp(key+'.*','i');
        return this
            .find({$or:[{title:keyword},{doctor:keyword},{summary:keyword},{language:keyword}]})
            .exec(cb)
    }
};

module.exports = MovieSchema;