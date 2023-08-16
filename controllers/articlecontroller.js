const catchasync = require('../utilities/catchasync');
const ExpressError = require('../utilities/expresserror');
const article=require('../models/article');
const { cloudinary } = require('../cloudinary');


const user=require('../models/user');

module.exports.allarticles=async(req,res)=>{
    const els=await article.find({});
  
    res.render('displayall',{els});
  
  }

  module.exports.addarticle=async (req,res)=>{
    
    res.render('addarticle');
}


module.exports.addarticlepost=async(req, res,next) => {
         
     
    const artic = new article(req.body.article);
    artic.images= req.files.map( f =>({
      url:f.path,
      filename:f.filename
   }))  
    artic.author= req.user._id;

    const us= await user.findById(req.user._id);
    us.articles.push(artic);

   // console.log(article);
    await artic.save();
    await us.save();
    req.flash('success','successfully made a new article');
    res.redirect(`/articles/${artic.id}`)
    
   
   
}


module.exports.deletearticle= async(req,res)=>{
    const {id}=req.params;
   
    const x=await article.findById(id);

    const us=await user.findByIdAndUpdate(x.author,{ $pull: { articles: id } });
    await article.findByIdAndDelete(id);
    req.flash('success','successfully deleted a new article')
    res.redirect('/articles');
}


module.exports.articleeditdisplay=async(req,res)=>{
    const {id}=req.params;

   const artic= await article.findById(id);
   if(!artic)
   {
     req.flash('error','article not found');
     res.redirect('/articles');
   }else{
    res.render('editarticle',{article: artic});
   }
  
}


module.exports.editarticle= async(req,res)=>{
    const {id}=req.params;
    console.log(req.body.deleteImages);
    const cmp=await article.findByIdAndUpdate(id,{...req.body.article});
    const imgs=req.files.map( f =>({
      url:f.path,
      filename:f.filename
   }))  ;

   cmp.images.push(...imgs);
   await cmp.save();

   if(req.body.deleteImages)
   { 
     for( let filename of req.body.deleteImages)
     {
      await cloudinary.uploader.destroy(filename);
     }
    await cmp.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}});
 
   }
    
    req.flash('success','successfully updated a new article')
    res.redirect(`/articles/${id}`);
}

module.exports.articledisplay=async(req,res)=>{
    const {id}=req.params;
  
   const artic= await article.findById(id)
   .populate({
       path:'comments',
       populate:{
         path:'author'
       }
   }).populate('author');
      //console.log(article);
     if(!artic)
     {
       req.flash('error','article not found');
       res.redirect('/articles');
     }else{
      res.render('show',{article:artic});
     }
  
  
  }

