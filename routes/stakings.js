var express = require("express");
const { Stakings, validate } = require("../models/staking");
const { Pools } = require("../models/pool");
const auth = require("../middleware/auth")

// const auth = require("../middleware/auth");
const _ = require("lodash");
var router = express.Router();

//Create Staking
router.post("/", [auth],async (req, res, next) => {
  try {
    //return res.status(200).send("Working...");
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const poolId = req.body.pool_id;
    const staking_amount = req.body.amount; 
    let pool = await Pools.findById(poolId);
    
    //Valid Staking Checks
    if (!pool) return res.status(404).send(`Pool Not found for the ID: ${poolId} `);
    if(staking_amount < pool.min_stake) return res.status(400).send(`${staking_amount} staking amount is less than minimum staking allowed i.e ${pool.min_stake}.`)
    
    let staking = new Stakings(
      _.pick(req.body, ["pool_id", "amount"])
    );
    staking.set({
      created_at: Date.now(),
      partner_id: req.user._id,
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
    });
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
