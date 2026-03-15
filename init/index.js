import express from 'express';
const app = express();
import mongoose from 'mongoose';
import initData from './data.js';
import Listing from '../models/listings.js';

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
  
  initData.data=initData.data.map((obj)=>({
    ...obj,
    owner:"69b632782afab21c706bea7e",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};