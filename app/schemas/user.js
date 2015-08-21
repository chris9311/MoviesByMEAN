var mongooes =  require('mongoose');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;
var UserSchema = new mongooes.Schema({
    name:{
        unique : true,
        type : String
    },
    password : {
        unique : true,
        type : String
    },
    role : {
        type:Number,
        default:0
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

UserSchema.methods = {
  comparePassword : function(_passwoed,cd){
      bcrypt.compare(_passwoed,this.password,function(err,isMatch){
          if(err)
              return cd(err);
          cd(null,isMatch);
      })
  }
};


UserSchema.pre('save',function(next){
    //console.info("1.1")
    var user  = this;
    if(this.isNew){
        //console.info('1.2')
        this.meta.createAt = this.meta.updateAt = Date.now();
    }
    else{
        //console.info('1.3')
        this.meta.updateAt = Date.now();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            //console.log(hash);
            next();
        });
    });
    //console.info('1.4')
    //next();
});

UserSchema.statics = {
    fetch: function(cb) {
        return this
            .find()
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById:function(id,cb){
        return this
            .findOne({_id:id})
            .exec(cb)
    }
};

module.exports = UserSchema;
