const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
  name: String,
  dob: String,
  email: String,
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
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    dob: Joi.date().required(),
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
    country: Joi.string().required(),
    //access_token: [Joi.string(), Joi.number()],
    //  birth_year: Joi.number().integer().min(1900).max(2013),
  })
    //.with("username", "birth_year")
    //.xor("password", "access_token")
    .with("password", "repeat_password");

  return schema.validate(user);
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
