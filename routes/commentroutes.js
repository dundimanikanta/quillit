const express=require('express');

const router=express.Router({mergeParams:true});


const catchasync = require('../utilities/catchasync');
const ExpressError = require('../utilities/expresserror');
const comment=require('../models/comment');
const article=require('../models/article');
const Joi =require('joi');

const {commentJoiSchema }=require('../joi_schemas');


const validatecomment=(req,res,next)=>{
    
    const {error}= commentJoiSchema.validate(req.body);
      if(error){
      const  msg= error.details.map( el => el.message).join(',')
        throw new ExpressError(msg,400);
      }else {
       next();
      }
}
const {isloggedin,iscommentAuthor}=require('./middleware');

router.post('/',isloggedin,validatecomment,catchasync(async(req,res,next)=>{
    const cmp=await article.findById(req.params.cmpid);
      const rev=new comment(req.body.comment); 
     rev.author=req.user._id;
     cmp.comments.push(rev);
      await cmp.save();
      await rev.save();
      req.flash('success','successfully made a new comment')
      res.redirect(`/articles/${cmp.id}`);
 }));
 
 router.delete('/:commentId', iscommentAuthor,isloggedin, catchasync(async (req, res) => {
    const { cmpid, commentId } = req.params;
    await article.findByIdAndUpdate(cmpid, { $pull: { comments: commentId } });
    await comment.findByIdAndDelete(commentId);
    req.flash('success','successfully deleted a new article')
    res.redirect(`/articles/${cmpid}`);
}))

module.exports=router;