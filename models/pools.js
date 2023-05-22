const joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");

var poolsSchema = mongoose.Schema({
  name: String,
  dob: String,
  email: String,
  phone: String,
  password: String,
  address: String,
  role: {
    type: String,
    default: "partner",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  refferal_code: String,
  reffered_by: String,
  balance: String,
  created_at: String,
  country: String,
});
poolsSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this.id, name: this.name, role: this.role, email: this.email },
    config.get("jwtPrivateKey"),
    { expiresIn: "30d" }
  );
  //console.log(process.env.baltiApp_jwtPrivateKey);
  return token;
};

function validate(pool) {
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
  return joi.validate(pool, schema);
}

var Pools = mongoose.model("Pools", poolsSchema);

module.exports.Pools = Pools;
module.exports.validate = validate;
module.exports.validateUpdate = validateUpdate;
