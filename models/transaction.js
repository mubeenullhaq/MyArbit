const Joi = require("joi");

var mongoose = require("mongoose");

var transactionsSchema = mongoose.Schema({
  partner_id:{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: {
      values: ["deposit", "withdrawl"],
      message: "type must be either deposit or withdrawl"
    }
  },
  amount: String,
  created_at: {
    type: Date,
    required: true,
  },
});

function validate(staking) {
  const schema = Joi.object({
    //partner_id: Joi.string().required(),
    type: Joi.string().valid('deposit', 'withdrawl').required(),
    amount: Joi.number().required(),
  });
  return schema.validate(staking);
}

var Transactions = mongoose.model("Transactions", transactionsSchema);

module.exports.Transactions = Transactions;
module.exports.validate = validate;
