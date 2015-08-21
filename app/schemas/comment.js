/**
 * Created by HUANGCH4 on 2015/7/29.
 */
var mongooes =  require('mongoose');
var Schema = mongooes.Schema;
var ObjectId = Schema.Types.ObjectId;

var CommentSchema = new Schema({
    movie:{
        type:ObjectId,
        ref:'Movie'
    },
    from:{
      type:ObjectId,
        ref:'User'
    },
    reply:[{
        from:{
            type:ObjectId,
            ref:'User'
        },
        to:{
            type:ObjectId,
            ref:'User'
        },
        content:String
    }],
    content:String,
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


CommentSchema.pre('save',function(next){
    //console.info("1.1")
    if(this.isNew){
        //console.info('1.2')
        this.meta.createAt = this.meta.updateAt = Date.now();
    }
    else{
        //console.info('1.3')
        this.meta.updateAt = Date.now();
    }
    //console.info('1.4')
    next();
});

CommentSchema.statics = {
    fetch: function(cb) {
        return this
            .find()
            .sort({"meta.createAt":1})
            .exec(cb)
    },
    findById:function(id,cb){
        return this
            .findOne({_id:id})
            .exec(cb)
    }
};

module.exports = CommentSchema;