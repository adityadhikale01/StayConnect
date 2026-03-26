import "dotenv/config";
import mongoose from 'mongoose';
import initData from './data.js';
import Listing from '../models/listings.js';

const MONGOURL = process.env.MONGO_URL;

const initDB = async () => {
  await Listing.deleteMany({});
  
  const dataWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: "69b632782afab21c706bea7e",
  }));
  await Listing.insertMany(dataWithOwner);
  console.log("data was initialized");
};

const main = async () => {
  if (!MONGOURL) {
    throw new Error("MONGO_URL is not defined. Add it to your .env file.");
  }

  await mongoose.connect(MONGOURL);
  console.log("connected to DB");

  await initDB();
  await mongoose.connection.close();
};

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
