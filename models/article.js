const mongoose=require('mongoose');
const comment = require('./comment')
const Schema=mongoose.Schema;

const articleSchema=new Schema({
    title:String,
    images:[

        {
            url:String,
            filename:String
        }
    ],
    description:String,
    body:String,
    author:
        {
            type: Schema.Types.ObjectId,
            ref:'user'
          }
    ,
    comments:[
        {
          type: Schema.Types.ObjectId,
          ref:'comment'
        }
    ]  
});


articleSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
      await comment.deleteMany({
          _id: {
              $in: doc.comments
          }
      })
  }
});

const article=new mongoose.model('article',articleSchema);

module.exports=article;