const express = require("express");
const cors = require("cors");
require("dotenv").config();
const client = require("./db/mongo-client");
const app = express();
const port = 5000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Math Mentor Server is Running Happily!");
});

app.listen(port, () => {
  console.log(`Math Mentor Server is listening on port ${port}`);
});