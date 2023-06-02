const express = require("express");
const cors = require("cors");
const users = require("../routes/users");
const pools = require("../routes/pools");
const stakings = require("../routes/stakings");
// const profile = require("../routes/profile");
// const products = require("../routes/products");
// const countries = require("../routes/countries");
// const cities = require("../routes/cities");
// const states = require("../routes/states");
// const orders = require("../routes/orders");
// const saveOrders = require("../routes/saveOrders");
// const shipmentCost = require("../routes/shipmentCost");
// const sellerProducts = require("../routes/seller/sellerProducts");
// const categories = require("../routes/categories");
// const customStore = require("../routes/customStore");
// const faqs = require("../routes/faqs");
// const reviews = require("../routes/reviews");
// const auth = require("../routes/auth");
// const verifymail = require("../routes/verifymail");
// const forgotPassword = require("../routes/forgotPassword");
// const resetPassword = require("../routes/resetPassword");
// //const xmlparser = require("express-xml-bodyparser");
// const scrape = require("../routes/scrape");
// const contactUs = require("../routes/contactUs");
// const memberFee = require("../routes/memberFees");
// const filterTags = require("../routes/filterTags");
// const newsLetterEmails = require("../routes/newLetterEmails");
// const deals = require("../routes/deals");
// const dealOrders = require("../routes/dealOrders");
// const dealCustomers = require("../routes/dealCustomers");

// const test = require("../routes/test");

module.exports = function (app) {
  // app.use(xmlparser());
  app.use(express.json());
  //app.use('/uploads/', express.static('uploads'))
  app.use(cors());
  app.options("*", cors());
  // app.use('/',hello)
  app.use("/api/user", users);
  app.use("/api/pools", pools);
  app.use("/api/stakings", stakings);

  // app.use("/api/profile", profile);
  // app.use("/api/scrape", scrape);
  // app.use("/api/forgotPassword", forgotPassword);
  // app.use("/api/resetPassword", resetPassword);
  // app.use("/api/product", products);
  // app.use("/api/countries", countries);
  // app.use("/api/cities", cities);
  // app.use("/api/states", states);
  // app.use("/api/orders", orders);
  // app.use("/api/saveOrders", saveOrders);
  // app.use("/api/shipmentCost", shipmentCost);
  // app.use("/api/sellerProducts", sellerProducts);
  // app.use("/api/categories", categories);
  // app.use("/api/customStore", customStore);
  // app.use("/api/reviews", reviews);
  // app.use("/api/auth", auth);
  // app.use("/api/verifyemail", verifymail);
  // app.use("/api/contactUs", contactUs);
  // app.use("/api/memberFee", memberFee);
  // app.use("/api/faqs", faqs);
  // app.use("/api/filterTags", filterTags);
  // app.use("/api/newsLetterEmails", newsLetterEmails);
  // app.use("/api/deals", deals);
  // app.use("/api/dealOrders", dealOrders);
  // app.use("/api/dealCustomers", dealCustomers);

  // app.use("/api/test", test);
};
