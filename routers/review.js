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

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const review = await reviewsCollection.findOne({ _id: ObjectId(id) });
    res.json(review);
  } catch (error) {
    res.json({ success: false });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await reviewsCollection.deleteOne({ _id: ObjectId(id) });
    res.json({ success: true, deleted: true });
  } catch (error) {
    res.json({ success: false });
  }
});

router.patch("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await reviewsCollection.updateOne(
      { _id: ObjectId(id) },
      { $set: req.body }
    );
    res.json({ success: true, edited: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

module.exports = router;
