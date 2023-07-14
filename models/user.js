const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
  name: String,
  dob: String,
  email: {
    type: String,
    unique: true,
  },
  phone: String,
  password: String,
  repeat_password: String,
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
  balance: {
    type: Number,
    default: 0,
  },
  total_staked: {
    type: Number,
    default: 0,
  },
  created_at: String,
  country: String,
  is_varified: Boolean,
});
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this.id,
      name: this.name,
      role: this.role,
      email: this.email,
      balance: this.balance,
      total_staked: this.total_staked,
    },
    config.get("jwtPrivateKey"),
    { expiresIn: "30d" }
  );
  //console.log(process.env.baltiApp_jwtPrivateKey);
  return token;
};

function validate(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    dob: Joi.date(),
    email: Joi.string().email().required(),
    phone: Joi.string(),
    password: Joi.string()
      .pattern(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
    repeat_password: Joi.ref("password"),
    address: Joi.string(),
    role: Joi.string(),
    isBlocked: Joi.boolean(),
    refferal_code: Joi.string(),
    reffered_by: Joi.string(),
    country: Joi.string(),
    //access_token: [Joi.string(), Joi.number()],
    //  birth_year: Joi.number().integer().min(1900).max(2013),
  })
    //.with("username", "birth_year")
    //.xor("password", "access_token")
    .with("password", "repeat_password");

  return schema.validate(user);
}

function validateUpdate(user) {
  const schema = Joi.object({
    _id: Joi.string(),
    name: Joi.string().min(2).max(50).required(),
    role: Joi.date(),
    email: Joi.string().email().required(),
    balance: Joi.number(),
    total_staked: Joi.number(),
    role: Joi.string(),
    isBlocked: Joi.boolean(),
    refferal_code: Joi.string(),
    reffered_by: Joi.string(),
    country: Joi.string(),
    //access_token: [Joi.string(), Joi.number()],
    //  birth_year: Joi.number().integer().min(1900).max(2013),
  });
  return schema.validate(user);
}

var User = mongoose.model("User", userSchema);

module.exports.User = User;
module.exports.validate = validate;
module.exports.validateUpdate = validateUpdate;
