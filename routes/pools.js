var express = require("express");
const { Pools, validate } = require("../models/pool");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const _ = require("lodash");
var router = express.Router();

//Create Pool
router.post("/", [auth, admin], async (req, res, next) => {
  try {
    //return res.status(200).send("Working...");
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let pool = await Pools.findOne({
      name: { $regex: "^" + req.body.name + "$", $options: "i" },
    });
    if (pool) return res.status(400).send("Pool name alredy registered");

    pool = new Pools(_.pick(req.body, ["name", "min_stake", "duration", "profit"]));
    await pool.save();

    return res.status(200).send(pool);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});
//Read All Pools
router.get("/", async (req, res, next) => {
  const pools = await Pools.find();
  if (!pools) res.status(404).send("No Pools exist. Please create pool first.");
  return res.status(200).send(pools);
});

//Update Hidden Status
router.put("/", [auth, admin], async (req, res, next) => {
  try {
    //return res.status(200).send("Working...");
    if (!req.body.poolId) return res.status(400).send("Pool ID not found to update");

    let pool = await Pools.findById(req.body.poolId);
    if (!pool) return res.status(404).send("NOT_FOUND");
    const updatedIsHidden = !pool.is_hidden;
    pool.set({
      is_hidden: !pool.is_hidden,
    });
    pool = await pool.save();
    return res.status(200).send({
      message: "Pool Updated Successfully",
      pool: pool,
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

module.exports = router;
