const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Requiring/Importing Routers
const service = require("./routers/service");
const services = require("./routers/services");
const review = require("./routers/review");
const user = require("./routers/user");

//Initiating Express
const app = express();
const port = 5000;

//Global Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Math Mentor Server is Running Happily!");
});

app.post("/get-jwt-token", (req, res) => {});
app.delete("/remove-jwt-token", (req, res) => {});

//Delegating to Routers
app.use("/service", service);
app.use("/services", services);
app.use("/review", review);
app.use("/user", user);

// Start Listening for Request
app.listen(port, () => {
  console.log(`Math Mentor Server is listening on port ${port}`);
});
