const Joi=require('joi');

const { number } = require('joi');
   
module.exports.articleJoiSchema = Joi.object({
    article: Joi.object({
        title: Joi.string().required(),
       
      // image: Joi.string().required(),
       
        description: Joi.string().required(),
        body: Joi.string().required()
       
    }).required(),

    deleteImages:Joi.array()
});


module.exports.commentJoiSchema = Joi.object({
    comment: Joi.object({
       
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
        
    }).required()
});


