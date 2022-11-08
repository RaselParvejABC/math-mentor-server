const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Requiring/Importing Routers
const service = require("./routers/service");
const services = require("./routers/services");
const review = require("./routers/review");
const reviews = require("./routers/reviews");

//Initiating Express
const app = express();
const port = 5000;

//Global Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Math Mentor Server is Running Happily!");
});

app.post("/get-jwt-token", (req, res) => {});
app.delete("/remove-jwt-token", (req, res) => {});

//Delegating to Routers
app.use("/service", service);
app.use("/services", services);
app.use("/review", review);
app.use("/reviews", reviews);

// Start Listening for Request
app.listen(port, () => {
  console.log(`Math Mentor Server is listening on port ${port}`);
});
