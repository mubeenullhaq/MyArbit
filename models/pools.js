const joi = require("joi");
var mongoose = require("mongoose");

var poolsSchema = mongoose.Schema({
  name: String,
  min_stake: Number,
  duration: Number,
  profit: Number,
});

function validate(pool) {
  const schema = {
    name: joi.string().min(2).max(50).required(),
    min_stake: joi.number().required(),
    duration: joi.number().required(),
    profit: joi.number().required(),
  };
  return joi.validate(pool, schema);
}

var Pools = mongoose.model("Pools", poolsSchema);

module.exports.Pools = Pools;
module.exports.validate = validate;
