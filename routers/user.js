const jwt = require("jsonwebtoken");
import { serialize } from "cookie";
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
  const tokenCookie = serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  res.setHeader("Set-Cookie", tokenCookie);
  res.json({ success: true });
});

const checkJWTToken = (req, res, next) => {
  const token = req.cookies.token;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (decodedToken?.userID) {
    next();
  } else {
    res.status(400).json({ message: "Invalid JWT Token" });
  }
};

router.get("/my-reviews", checkJWTToken, async (req, res) => {
  const resultArray = reviewsCollection
    .aggregate([
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

module.exports = router;
