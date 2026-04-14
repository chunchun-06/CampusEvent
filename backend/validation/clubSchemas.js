const Joi = require('joi');

const createClubSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(5).required(),
});

module.exports = { createClubSchema };
