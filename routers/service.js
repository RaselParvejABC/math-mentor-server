const express = require("express");
const router = express.Router();

const { ObjectId } = require("mongodb");
const { mongoClient } = require("../db/mongo-client");
const servicesCollection = mongoClient.db("math-mentor").collection("services");
const reviewsCollection = mongoClient.db("math-mentor").collection("reviews");

router.post("/", async (req, res) => {
  const newService = req.body;

  try {
    await servicesCollection.insertOne(newService);
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false });
  }
});

router.get("/:id", async (req, res) => {
  const objectID = ObjectId(req.params.id);
  const filter = { _id: objectID };
  const doc = await servicesCollection.findOne(filter);
  res.json(doc);
});

router.get("/:id/rating", async (req, res) => {
  const objectIDString = req.params.id;
  const filter = { serviceID: objectIDString };

  const avg = await reviewsCollection
    .aggregate([
      { $match: filter },
      { $group: { _id: null, avg_rating: { $avg: "$rating" } } },
      { $project: { avg_rating: 1 } },
    ])
    .toArray();

  res.json({ average: avg[0]?.avg_rating ?? null });
});

module.exports = router;
