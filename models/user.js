const mongoose=require('mongoose');
const passprtLocalMongoose=require('passport-local-mongoose');
const Schema=mongoose.Schema;


const userSchema=new Schema({
    
    email:{
        type:String,
        required:true,
        unique:true
    },
    articles:[
        {
            type: Schema.Types.ObjectId,
            ref:'article'
        }
    ]
    
   
});

userSchema.plugin(passprtLocalMongoose);


const user=mongoose.model('user',userSchema);

module.exports=user;