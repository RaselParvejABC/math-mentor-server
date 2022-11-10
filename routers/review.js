const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { getMongoClient } = require("../db/mongo-client");

const mongoClient = getMongoClient();
const reviewsCollection = mongoClient.db("math-mentor").collection("reviews");

router.post("/", async (req, res) => {
  const newReview = req.body;
  newReview.timestamp = new Date().getTime();

  try {
    await reviewsCollection.insertOne(newReview);
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await reviewsCollection.deleteOne({ _id: ObjectId(id) });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await reviewsCollection.updateOne({ _id: ObjectId(id) }, req.body);
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false });
  }
});

module.exports = router;
