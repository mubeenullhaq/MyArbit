const joi = require("joi");

var mongoose = require("mongoose");

var transactionsSchema = mongoose.Schema({
  partner_id: String,
  type: String,
  amount: String,
});

function validate(transaction) {
  const schema = {
    name: joi.string().min(2).max(50).required(),
    dob: joi.date().required(),
    email: joi.string().min(5).max(255).required().email().required(),
    phone: joi.string(),
    password: joi.string().min(5).max(255).required(),
    address: joi.string(),
    role: joi.string(),
    isBlocked: joi.boolean(),
    refferal_code: joi.string(),
    reffered_by: joi.string(),
    created_at: joi.date().required(),
    country: joi.string().required(),
  };
  return joi.validate(transaction, schema);
}

var Transactions = mongoose.model("Transactions", transactionsSchema);

module.exports.Transactions = Transactions;
module.exports.validate = validate;
