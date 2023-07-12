var express = require("express");
const { Transactions, validate } = require("../models/transaction");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// const auth = require("../middleware/auth");
const _ = require("lodash");
var router = express.Router();

//Create transaction
router.post("/", [auth], async (req, res, next) => {
  try {
    //return res.status(200).send("Working...");
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let transaction = new Transactions(_.pick(req.body, ["type", "amount"]));
    transaction.set({
      partner_id: req.user._id,
      created_at: Date.now(),
      status: transaction.type === "withdrawl" ? "Requested" : "Served",
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

//Read All transactions of a logged in User
router.get("/", [auth], async (req, res, next) => {
  try {
    let transactions = await Transactions.find({ partner_id: req.user._id }).populate({
      path: "partner_id",
      options: { strictPopulate: false },
    });
    if (!transactions) {
      return res.status(400).send({ message: "No transactions found." });
    }
    return res.status(200).send(transactions);
  } catch (e) {
    return res.send(e.message);
  }
});

module.exports = router;
