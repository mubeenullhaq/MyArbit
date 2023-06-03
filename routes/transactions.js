var express = require("express");
const { Transactions, validate } = require("../models/transaction");
const auth = require("../middleware/auth")

// const auth = require("../middleware/auth");
const _ = require("lodash");
var router = express.Router();

//Create transaction
router.post("/", [auth],async (req, res, next) => {
  try {
    //return res.status(200).send("Working...");
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
     
    let transaction = new Transactions(
      _.pick(req.body, [ "type", "amount" ])
    );
    transaction.set({
      partner_id: req.user._id,
      created_at: Date.now(),
    });
    await transaction.save();

    return res.status(200).send({
      message: `Amount ${req.body.type} Successfull`,
      transaction,
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
});


module.exports = router;
