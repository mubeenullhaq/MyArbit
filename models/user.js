const joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
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
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this.id, name: this.name, role: this.role, email: this.email },
    config.get("jwtPrivateKey"),
    { expiresIn: "30d" }
  );
  //console.log(process.env.baltiApp_jwtPrivateKey);
  return token;
};

function validate(user) {
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
  return joi.validate(user, schema);
}

function validateUpdate(user) {
  const schema = {
    name: joi.string().min(2).max(50),
    number: joi.string(),
    password: joi.string().min(5).max(255),
    location: joi.string(),
    locationDesc: joi.string(),
    email: joi.string().min(5).max(255).email(),
    isBlocked: joi.boolean(),
    //picture
  };
  return joi.validate(user, schema);
}

var User = mongoose.model("User", userSchema);

module.exports.User = User;
module.exports.validate = validate;
module.exports.validateUpdate = validateUpdate;
