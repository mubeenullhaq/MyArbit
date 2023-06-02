const Joi = require("joi");
var mongoose = require("mongoose");

var stakingsSchema = mongoose.Schema({
  pool_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pools",
  },
  pool_info: {
    type: Object,
    required: true,
  },
  partner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  amount: String,
  status: {
    type: String,
    default: "in process",
  },
  created_at: {
    type: String,
    required: true,
  },
});

function validate(staking) {
  const schema = Joi.object({
    pool_id: Joi.string().required(),
    pool_info: Joi.object({
      pool_name: Joi.string(),
      profit: Joi.number(),
    }),
    partner_id: Joi.string().required(),
    amount: Joi.number().required(),
    status: Joi.string(),
    created_at: Joi.date(),
  });
  return schema.validate(staking);
}

var Stakings = mongoose.model("Stakings", stakingsSchema);

module.exports.Stakings = Stakings;
module.exports.validate = validate;
