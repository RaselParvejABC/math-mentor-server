const express = require("express");
const router = express.Router();

const { mongoClient } = require("../db/mongo-client");
const servicesCollection = mongoClient.db("math-mentor").collection("services");

router.post("/", async (req, res) => {
  const options = {};
  if (req.body.limit) {
    options["limit"] = req.body.limit;
  }
  if (req.body.offset) {
    options["offset"] = req.body.offset;
  }

  const cursor = servicesCollection.find({}, options);
  const resultArray = await cursor.toArray();

  res.json(resultArray);
});

module.exports = router;
