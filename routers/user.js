const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const { ObjectId } = require("mongodb");
const { getMongoClient } = require("../db/mongo-client");
const mongoClient = getMongoClient();
const servicesCollection = mongoClient.db("math-mentor").collection("services");
const reviewsCollection = mongoClient.db("math-mentor").collection("reviews");

router.get("/token/:uid", (req, res) => {
  const uid = req.params.uid;
  const payload = { userID: uid, timestamp: new Date().getTime() };
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  res.cookie("token", token, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 86_400_000,
    sameSite: "none",
  });
  res.json({ success: true });
});

const checkJWTToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.sendStatus(400);
    return;
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    res.sendStatus(401);
    return;
  }
  if (decodedToken?.userID) {
    req.userID = decodedToken.userID;
    next();
  } else {
    res.sendStatus(401);
  }
};

router.get("/my-reviews", checkJWTToken, async (req, res) => {
  let resultArray = await reviewsCollection
    .aggregate([
      {
        $match: {
          userID: req.userID,
        },
      },
    ])
    .toArray();

  resultArray = await Promise.all(
    resultArray.map(async (review) => {
      const serviceObjectID = ObjectId(review.serviceID);
      const filter = { _id: serviceObjectID };
      const service = await servicesCollection.findOne(filter);

      return { ...review, serviceTitle: service["title"] };
    })
  );

  res.json(resultArray);
});

router.delete("/sign-out", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    maxAge: 86_400_000,
  });
  res.json({ success: true });
});

module.exports = router;
