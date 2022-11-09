const express = require("express");
const router = express.Router();
const { getMongoClient } = require("../db/mongo-client");

const mongoClient = getMongoClient();
const reviewsCollection = mongoClient.db("math-mentor").collection("reviews");

router.post("/", async (req, res) => {
  const newReview = req.body;

  try {
    await reviewsCollection.insertOne(newReview);
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false });
  }
});
module.exports = router;
