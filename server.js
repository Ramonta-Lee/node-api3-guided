const express = require("express"); // importing a CommonJS module
const morgan = require("morgan");
const helmet = require("helmet");

const hubsRouter = require("./hubs/hubs-router.js");

const server = express();

// Middleware - These are global Middleware read top to bottom
server.use(express.json()); // built-in Middleware
server.use(morgan("dev"));
server.use(helmet());
// server.use(logger);

// routes - endpoints
server.use("/api/hubs", logger, gateKeeper("mellon"), hubsRouter);

// Read left to right
server.get("/", logger, gateKeeper("notto"), greeter, (req, res) => {
  // const nameInsert = req.name ? ` ${req.name}` : "";

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome ${req.cohort} to the Lambda Hubs API</p>
    `);
});

module.exports = server;

// write a gatekeeper Middleware that reads a password from req.headers
// if the password is "mellon" let the request continue
// if the password is not "mellon" send a 400 status code and a message to the client

// My function for Middleware
// function gateKeeper(req, res, next) {
//   if (req.headers.password === "mellon") {
//     res.status(200).json({ message: "You shall pass" });
//   } else {
//     res.status(400).json({ error: "You shall Not Pass!" });
//   }
//   next();
// }

// It's reusable meaning you can apply gatekeeper wherever you want to require this password

function gateKeeper(guess) {
  return function(req, res, next) {
    // write a gatekeeper middleware that

    // reads a password from req.headers
    const password = req.headers.password;

    // if the password is "mellon"
    // toLowerCase makes the case insensitive.
    if (password && password.toLowerCase() === guess) {
      next();
    } else {
      res.status(401).json({ error: "you shall Not Pass!" });
    }
  };
}

function greeter(req, res, next) {
  req.cohort = "Web 26";
  next();
}

function logger(req, res, next) {
  // next when invoked will move the results to the next Middleware on the stack
  console.log(`${req.method} Request to ${req.originalUrl} `);
  next();
}

// Example using a GET

// function fetchHubs (){
//   const endpoint = "http://lotr.com/hubs";
//   const options = {
//     headers: {
//       password: "mellon"
//     }
//   }
//   axios.get(endpoint, options).then().catch()
// }
