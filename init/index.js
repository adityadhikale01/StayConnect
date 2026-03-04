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
  app.listen(3000, () => {
    console.log("server is running on port 3000");
  });
}

const initDB = async () => {
  await Listing.deleteMany({});

  // Transform data to match schema (image should be URL string, not object)
  const transformedData = initData.data.map(item => ({
    ...item,
    image: item.image.url
  }));

  await Listing.insertMany(transformedData);
  console.log("data was initialized");
};