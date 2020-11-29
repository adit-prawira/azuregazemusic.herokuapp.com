const Joi = require("joi");

module.exports.ReviewSchema = Joi.object({
    review: Joi.object({
        author: Joi.string(),
        body: Joi.string().required(),
    }),
});
