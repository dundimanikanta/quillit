
const article=require('../models/article');
const ExpressError = require('../utilities/expresserror');
const {articleJoiSchema ,commentJoiSchema}=require('../joi_schemas');
const comment = require('../models/comment');
module.exports.isloggedin = (req,res,next)=>{
    if(!req.isAuthenticated())
    {
       req.session.returnTo=req.originalUrl;
     req.flash('error','you must be signed in');
     return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validatearticle=(req,res,next)=>{
    
    const {error}= articleJoiSchema.validate(req.body);
      if(error)
      {
        msg= error.details.map( el => el.message).join(',')
        throw new ExpressError(msg,400);
      }
      else {
       next();
      }

}
module.exports.isAuthor =async (req,res,next)=>{
  const {id}=req.params;
  const cmpgnd=await article.findById(id);
    if(!req.user)
    {
      req.flash('error','you are not logged in')
      return  res.redirect(`/login`);  
    }

  if(  !cmpgnd.author.equals(req.user._id ) )
  { req.flash('error','you are no the author')
  return  res.redirect(`/articles/${id}`);  
  }
  next();

}

module.exports.iscommentAuthor =async (req,res,next)=>{
  const {id,commentId}=req.params;
  const rev=await comment.findById(commentId);

  if( !rev.author.equals(req.user._id ) )
  { req.flash('error','you are not the author of the comment')
  return  res.redirect(`/articles/${id}`);  
  }
  next();

}

