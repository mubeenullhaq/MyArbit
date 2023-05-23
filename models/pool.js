const Joi = require("joi");
var mongoose = require("mongoose");

var poolsSchema = mongoose.Schema({
  name: String,
  min_stake: Number,
  duration: Number,
  profit: Number,
});

function validate(pool) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    min_stake: Joi.number().required(),
    duration: Joi.number().required(),
    profit: Joi.number().required(),
  });

  return schema.validate(pool);
}

var Pools = mongoose.model("Pools", poolsSchema);

module.exports.Pools = Pools;
module.exports.validate = validate;
