const express = require("express");
const app = express();
const mongoose = require("mongoose");
const initData = require("./data.js");
const { Listing } = require("../models/listings.js"); 

const MONGO_URL = "mongodb://127.0.0.1:27017/StayConnect";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
  await initDB();
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};