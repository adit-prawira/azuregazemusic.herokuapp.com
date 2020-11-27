const Joi = require("joi");

module.exports.ReviewSchema = Joi.object({
    author: Joi.string(),
    body: Joi.string().required(),
}).required();
