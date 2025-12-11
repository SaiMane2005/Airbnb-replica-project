const Joi = require('joi');
const review = require('./models/review');

// Server-side validation before saving to DB
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),

        // FIXED: image is an object, not a string
        image: Joi.object({
            filename: Joi.string().allow("", null),
            url: Joi.string().uri().allow("", null)
        }).required()

    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});
