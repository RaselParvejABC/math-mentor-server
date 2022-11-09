const express = require("express");
const router = express.Router();

const { getMongoClient } = require("../db/mongo-client");
const mongoClient = getMongoClient();
const servicesCollection = mongoClient.db("math-mentor").collection("services");

router.post("/", async (req, res) => {
  const options = {};
  if (req.body.limit) {
    options["limit"] = req.body.limit;
  }
  if (req.body.offset) {
    options["skip"] = req.body.offset;
  }

  const cursor = servicesCollection.find({}, options);
  const resultArray = await cursor.toArray();

  res.json(resultArray);
});

router.get("/count", async (req, res) => {
  const count = await servicesCollection.countDocuments();
  res.json(count);
});

module.exports = router;
