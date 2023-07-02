const Joi = require("joi");
var mongoose = require("mongoose");

var stakingsSchema = mongoose.Schema({
  pool_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pools",
    required: true,
  },
  pool_info: {
    type: Object,
    required: true,
  },
  partner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  partner_info: {
    type: Object,
    required: true,
  },
  amount: String,
  status: {
    type: String,
    default: "in_process",
    enum: {
      values: ["in_process", "completed"],
      message: "type must be either in_process or completed"
    }
  },
  created_at: {
    type: String,
    required: true,
  },
});

function validate(staking) {
  const schema = Joi.object({
    pool_id: Joi.string().required(),
    amount: Joi.number().required(),
    status: Joi.string(),
    created_at: Joi.date(),
  });
  return schema.validate(staking);
}

var Stakings = mongoose.model("Stakings", stakingsSchema);

module.exports.Stakings = Stakings;
module.exports.validate = validate;
