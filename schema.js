import joi from 'joi';

const listingSchema= joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required().min(0),
        location: joi.string().required(),
        country: joi.string().required(),
        image: joi.string().allow("",null)
    }).required(),
    
});


// Validation schema for reviews

const reviewSchema = joi.object({
    review: joi.object({
  rating: joi.number().required().min(1).max(5),
  comment: joi.string().required(),
  CreatedAt: joi.date().default(Date.now)
    }).required()
});

export { listingSchema, reviewSchema };