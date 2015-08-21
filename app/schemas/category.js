var mongooes =  require('mongoose');
Schema = mongooes.Schema;
var ObjectId = Schema.Types.ObjectId;

var CategorySchema = new Schema({
    name : String,
    movies : [{
        type:ObjectId,
        ref:'Movie'
    }],
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


CategorySchema.pre('save',function(next){
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

CategorySchema.statics = {
    fetch: function(cb) {
        return this
            .find()
            .sort('meta.createAt')
            .exec(cb)
    },
    findById:function(id,cb){
        return this
            .findOne({_id:id})
            .populate('movies')
            .exec(cb)
    }
};

module.exports = CategorySchema;