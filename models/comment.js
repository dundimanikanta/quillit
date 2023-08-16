const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const commentSchema=new Schema({
    body:String,
    
    rating:Number,
    author:
    {
        type: Schema.Types.ObjectId,
        ref:'user'
      }

   
});




const comment=new mongoose.model('comment',commentSchema);

module.exports=comment;