const express=require('express');

const router=express.Router();


const catchasync = require('../utilities/catchasync');
const ExpressError = require('../utilities/expresserror');
const article=require('../models/article');
const {isloggedin,isAuthor,validatearticle}=require('./middleware');
const Joi =require('joi');

const multer=require('multer');

const {storage}=require('../cloudinary/index')
const upload=multer({storage})

const {articleJoiSchema }=require('../joi_schemas')
 const {allarticles,addarticle,addarticlepost,deletearticle,articleeditdisplay,articledisplay, editarticle}=require("../controllers/articlecontroller");
router.get('/',catchasync(allarticles ) );
  
router.get('/add',isloggedin, catchasync( addarticle))
  
router.post('/',isloggedin,upload.array('image'),  validatearticle ,catchasync( addarticlepost))
  
//  router.post('/',upload.array('image'),(req,res)=>{
//          console.log(req.body,req.files);
//  })


router.get("/:id",catchasync(articledisplay))


router.delete('/:id',isAuthor,isloggedin, catchasync(deletearticle))


router.get('/:id/edit',isAuthor,isloggedin, catchasync(articleeditdisplay ))

router.put('/:id', isAuthor,isloggedin, upload.array('image'),validatearticle, catchasync( editarticle))


module.exports=router;