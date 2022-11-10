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
    httpOnly: true,
    maxAge: 86_400_000,
  });
  res.json({ success: true });
});

const checkJWTToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log("token", token);
  if (!token) {
    res.sendStatus(400);
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    res.sendStatus(401);
  }
  if (decodedToken?.userID) {
    console.log("middleware passed");
    req.userID = decodedToken.userID;
    next();
  } else {
    res.sendStatus(401);
  }
};

router.get("/my-reviews", checkJWTToken, async (req, res) => {
  const resultArray = reviewsCollection
    .aggregate([
      {
        $match: {
          _id: ObjectId(req.userID),
        },
      },
      {
        $addFields: {
          serviceObjectId: { $toObjectId: "$serviceID" },
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "serviceObjectID",
          foreignField: "_id",
          as: "service",
        },
      },
    ])
    .toArray();
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
