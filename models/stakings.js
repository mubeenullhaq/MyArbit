const joi = require("joi");
var mongoose = require("mongoose");

var stakingsSchema = mongoose.Schema({
  staking_id: String,
  amount: String,
  status: {
    type: String,
    default: "in process",
  },
  created_at: String,
});

function validate(staking) {
  const schema = {
    staking_id: joi.string().min(2).max(50).required(),
    amount: joi.number().required(),
    status: joi.string().required().email().required(),
    created_at: joi.date().required(),
  };
  return joi.validate(staking, schema);
}

var Stakings = mongoose.model("Stakings", stakingsSchema);

module.exports.Stakings = Stakings;
module.exports.validate = validate;
