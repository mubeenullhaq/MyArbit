const Joi = require("joi");
var mongoose = require("mongoose");

var poolsSchema = mongoose.Schema({
  name: String,
  min_stake: {
    type: Number,
    default: 50,
  },
  duration: Number,
  profit: Number,
  is_hidden: {
    type: Boolean,
    default: false,
  },
});

function validate(pool) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    min_stake: Joi.number(),
    duration: Joi.number().required(),
    profit: Joi.number().required(),
    is_hidden: Joi.bool(),
  });

  return schema.validate(pool);
}

var Pools = mongoose.model("Pools", poolsSchema);

module.exports.Pools = Pools;
module.exports.validate = validate;
