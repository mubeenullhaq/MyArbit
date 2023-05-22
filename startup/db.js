const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  // const dbUri =
  if (!config.get("dbUri")) {
    throw new Error("Fatal Error: dbUri is not defined");
  } else {
    //mongoose.set('useCreateIndex', true)
    winston.log('Info', config.get("dbUri"))
    mongoose
      .connect(config.get("dbUri"), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        winston.log("info", "Connected to Mongodb");
        console.log("Connected to Mongodb");
        // require("log-timestamp");
        // console.error(err);
      })
      .catch((err) => {
        winston.log("error", `Connection failed to MongoDB${err.stack}`);

        // require("log-timestamp");
        // console.error("Connection Failed to Mongodb");
      });
  }
};
