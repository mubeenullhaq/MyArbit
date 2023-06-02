var express = require("express");
const { Pools, validate } = require("../models/pool");
const auth = require("../middleware/auth");
const _ = require("lodash");
var router = express.Router();

//Create Pool
router.post("/", async (req, res, next) => {
  try {
    //return res.status(200).send("Working...");
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let lowerPoolName = req.body.name.toLowerCase();
    let pool = await Pools.findOne({ name: lowerPoolName });
    if (pool) return res.status(400).send("User alredy registered");

    pool = new Pools(
      _.pick(req.body, ["name", "min_stake", "duration", "profit"])
    );
    pool.set({ name: lowerPoolName });
    await pool.save();

    return res.status(200).send(pool);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});
//Read All Pools
router.get("/", async (req, res, next) =>{
  const pools = await Pools.find();
  if(!pools) res.status(404).send("No Pools exist. Please create pool first.");
  return res.status(200).send(pools);
})
//Update User by ID
router.put("/", [auth], async (req, res, next) => {
  try {
    const { error } = validateUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let users = await User.findOneAndUpdate(
      { _id: req.user._id },
      _.pick(req.body, ["name", "email", "number", "location", "locationDesc"]),
      { new: true }
    );
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
router.get("/", async (req, res, next) => {
  try {
    let users = await User.find();
    if (!users) {
      return res.status(400).send({ message: "No user found" });
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

    if (!user)
      return res.status(404).send("The user with given id was not found...");
    res.send(user);
  } catch (e) {
    return res.send(e);
  }
});
module.exports = router;
