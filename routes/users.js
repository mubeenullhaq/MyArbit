var express = require("express");
const { User, validate, validateUpdate } = require("../models/user");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const _ = require("lodash");
const bcrypt = require("bcrypt");
var router = express.Router();

//User Login
router.post("/login", async (req, res) => {
  try {
    // const { error } = validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);
    //return res.send('ok')
    if (!req.body.email) return res.status(400).send("Email required...");
    if (!req.body.password) return res.status(400).send("Password required...");
    let lowerEmail = req.body.email.toLowerCase();
    let user = await User.findOne({ email: lowerEmail });
    if (!user) return res.status(400).send("Invalid email or password");
    // const createdAt = new mongoose.Types.ObjectId(user._id).getTimestamp()
    // console.log(createdAt)
    // return
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);

    if (!isValidPassword) return res.status(400).send("Invalid email or password");

    const token = user.generateAuthToken();

    const userObj = {
      id: user.id,
      name: user.name,
      email: user.email,
      balance: user.balance,
      role: user.role,
      total_staked: user.total_staked,
    };

    const reponse = {
      idToken: token,
      user: userObj,
    };
    // setTimeout(() => {
    //  console.log("this is the first message");
    return res.send(reponse);
    //}, 5000);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//Create User
router.post("/", async (req, res, next) => {
  try {
    //return res.status(200).send("Working...");
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let lowerEmail = req.body.email.toLowerCase();
    let user = await User.findOne({ email: lowerEmail });
    if (user) return res.status(400).send("User alredy registered");

    user = new User(_.pick(req.body, ["name", "email", "number", "password", "location", "locationDesc"]));
    user.set({ email: lowerEmail });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    await user.save();
    const token = user.generateAuthToken();
    const userObj = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    const reponse = {
      idToken: token,
      user: userObj,
    };
    return res.status(200).send(reponse);
  } catch (e) {
    return res.status(500).send(e);
  }
});
//Update User by ID
// router.put("/", [auth], async (req, res, next) => {
//   try {
//     const { error } = validate(req.body);
//     if (error) return res.status(400).send(error.details[0].message);
//     let users = await User.findOneAndUpdate({ _id: req.user._id }, _.pick(req.body, ["name", "email", "number", "location", "locationDesc"]), { new: true });
//     if (!users) {
//       return res.status(400).send({ message: "No user found to Update" });
//     }
//     // users[req.body.name] = req.body.value;
//     // await users.save();
//     return res.status(200).send(users);
//   } catch (e) {
//     return res.send(e);
//   }
// });

//Update User for admin only
router.put("/update/admin", [auth, admin], async (req, res, next) => {
  try {
    const { error } = validateUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let users = await User.findOneAndUpdate({ _id: req.body._id }, _.pick(req.body, ["name", "email", "role", "balance", "total_staked"]), { new: true });
    if (!users) {
      return res.status(400).send({ message: "No user found to Update" });
    }
    // users[req.body.name] = req.body.value;
    // await users.save();
    return res.status(200).send(users);
  } catch (e) {
    return res.send(e);
  }
});

// //Block User
// //Update User for admin only
router.put("/block", [auth, admin], async (req, res, next) => {
  try {
    //if () return res.status(400).send(error.details[0].message);
    let users = await User.findOneAndUpdate({ _id: req.body.partnerId }, { isBlocked: req.body.status }, { new: true });
    if (!users) {
      return res.status(400).send({ message: "No user found to Update" });
    }
    // users[req.body.name] = req.body.value;
    // await users.save();
    return res.status(200).send(users);
  } catch (e) {
    return res.send(e);
  }
});

//Change blocked status of a User by ID
router.put("/blockUser/:id", async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).send({ message: "No user found to Update" });
    }
    user.isBlocked = !user.isBlocked;
    await user.save();
    // users[req.body.name] = req.body.value;
    // await users.save();
    return res.status(200).send(user);
  } catch (e) {
    return res.send(e);
  }
});

//Search users based on filters
router.get("/search", (req, res) => {});

//Read Single User By ID
router.get("/:id", async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).send({ message: "No user found" });
    }
    return res.status(200).send(user);
  } catch (e) {
    return res.send(e);
  }
});
//Read All Users
router.get("/", [auth, admin], async (req, res, next) => {
  try {
    let users = await User.find().select("-password");
    if (!users) {
      return res.status(400).send({ message: "NOT_FOUND" });
    }
    return res.status(200).send(users);
  } catch (e) {
    return res.send(e);
  }
});

//Delete a user by Id
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);

    if (!user) return res.status(404).send("The user with given id was not found...");
    res.send(user);
  } catch (e) {
    return res.send(e);
  }
});
module.exports = router;
