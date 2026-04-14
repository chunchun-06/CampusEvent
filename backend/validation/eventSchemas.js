const Joi = require('joi');

const createEventSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().min(10).required(),
  date: Joi.date().iso().required(),
  venue: Joi.string().min(2).max(200).required(),
  type: Joi.string().valid('club', 'department').required(),
  ref_id: Joi.number().integer().positive().required(),
  capacity: Joi.number().integer().positive().optional(),
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('approved', 'rejected').required(),
});

module.exports = { createEventSchema, updateStatusSchema };
