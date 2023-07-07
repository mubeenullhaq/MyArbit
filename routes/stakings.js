var express = require("express");
const { Stakings, validate } = require("../models/staking");
const { Pools } = require("../models/pool");
const { User } = require("../models/user");
const auth = require("../middleware/auth");

// const auth = require("../middleware/auth");
const _ = require("lodash");
var router = express.Router();

//Create Staking
router.post("/", [auth], async (req, res, next) => {
  try {
    //return res.status(200).send("Working...");
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const poolId = req.body.pool_id;
    let amount_staked = req.body.amount_staked;
    let pool = await Pools.findById(poolId);
    let user = await User.findById(req.user._id);
    amount_staked = parseInt(amount_staked, 10);

    //Valid Staking Checks
    if (!pool)
      return res.status(404).send(`Pool Not found for the ID: ${poolId} `);
    if (!user) return res.status(404).send(`User Not found.. `);

    if (amount_staked < pool.min_stake)
      return res
        .status(400)
        .send(
          `${amount_staked} staking amount is less than minimum staking allowed i.e ${pool.min_stake}.`
        );
    if (amount_staked > user.balance)
      return res.status(400).send("INSUFFICIENT_BALANCE");

    //Update User Balnce and staking amount
    user.balance = user.balance - amount_staked;
    user.total_staked = user.total_staked + amount_staked;
    let updated_user = await User.findOneAndUpdate({ _id: user._id }, user, {
      new: true,
    });

    //Creat new staking
    let staking = new Stakings(
      _.pick(req.body, ["pool_id", "amount_staked", "auto_stake"])
    );
    staking.set({
      created_at: Date.now(),
      partner_id: user._id,
      partner_info: {
        name: user.name,
        email: user.email,
      },
      pool_info: {
        name: pool.name,
        duration: pool.duration,
        profit: pool.profit,
      },
    });
    await staking.save();

    return res.status(200).send({
      message: "Amount Staked Successfull",
      staking,
      updated_user,
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

//Read all in process Stakings of a Logged In partner
router.get("/", [auth], async (req, res, next) => {
  try {
    //return res.status(200).send("Working...");
    //const { error } = validate(req.body);
    //if (error) return res.status(400).send(error.details[0].message);
    //const poolId = req.body.pool_id;
    //const staking_amount = req.body.amount;
    // let pool = await Pools.findById(poolId);
    // let user = await User.findById(req.user._id);
    // //Valid Staking Checks
    // if (!pool) return res.status(404).send(`Pool Not found for the ID: ${poolId} `);
    // if(staking_amount < pool.min_stake) return res.status(400).send(`${staking_amount} staking amount is less than minimum staking allowed i.e ${pool.min_stake}.`)
    let stakings = await Stakings.find({
      partner_id: req.user._id,
      status: "in_process",
    });
    if (!stakings) return res.status(404).send("NO_STAKINGS_FOUND");
    return res.status(200).send(stakings);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

//Read all completed Stakings of a Logged In partner
router.get("/history", [auth], async (req, res, next) => {
  try {
    let stakings = await Stakings.find({
      partner_id: req.user._id,
      status: "completed",
    });
    if (!stakings) return res.status(404).send("NO_STAKINGS_FOUND");
    return res.status(200).send(stakings);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

//Read Single Pool By ID
router.get("/:id", async (req, res, next) => {
  try {
    let pool = await Pools.findOne({ _id: req.params.id });
    if (!pool) {
      return res.status(404).send({ message: "No pool found" });
    }
    return res.status(200).send(pool);
  } catch (e) {
    return res.send(e);
  }
});

//Read All Pools
router.get("/", async (req, res, next) => {
  try {
    let pools = await Pools.find();
    if (!pools) {
      return res.status(400).send({ message: "No user found" });
    }
    return res.status(200).send(pools);
  } catch (e) {
    return res.send(e);
  }
});

//Update Pool by ID
// router.put("/", async (req, res, next) => {
//   try {
//     const { error } = validateUpdate(req.body);
//     if (error) return res.status(400).send(error.details[0].message);
//     let users = await User.findOneAndUpdate(
//       { _id: req.user._id },
//       _.pick(req.body, ["name", "email", "number", "location", "locationDesc"]),
//       { new: true }
//     );
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

//Delete a Pool by Id
router.delete("/:id", async (req, res) => {
  try {
    const pool = await Pools.findByIdAndRemove(req.params.id);

    if (!pool)
      return res.status(404).send("The pool with given id was not found...");
    res
      .status(200)
      .send({ message: "Following Pool Successfully Deleted", Pool: pool });
  } catch (e) {
    return res.send(e.message);
  }
});

module.exports = router;
