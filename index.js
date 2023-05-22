var winston = require("winston");
var { Loggly } = require("winston-loggly-bulk");
const config = require("config");
const express = require("express");
const app = express();

winston
  .add(
    new Loggly({
      token: "2e5cef6a-dc5e-4f66-a223-e1e5fda59e9e",
      subdomain: "hadin",
      tags: ["My-Arbit_Logs"],
      json: true,
    })
  )
  .add(new winston.transports.Console());


require("./startup/routes")(app);
require("./startup/db")();
require("./startup/prod")(app);

if (!config.get("jwtPrivateKey")) {
    // console.error("FATAL ERROR: jwtPrivateKey is not defined");
    winston.log("error", "FATAL ERROR: jwtPrivateKey is not defined");
    process.exit(1);
  }

  let port = process.env.PORT || 4000;

app.listen(port, () => {
  // require("log-timestamp");
  winston.log("info", `Started listening on PORT=${port}`);
  // consoled.log(`Listening on ${port}`);
});

process.on("uncaughtException", (err) => {
  // require("log-timestamp");
  // loggly.log(err, ["error"]);
  winston.log("error", err.stack);
  // console.error(err);
});
