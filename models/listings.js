import mongoose from 'mongoose';
import Review from '../models/reviews.js';

const schema = mongoose.Schema;

const listingSchema = new schema({
    title: { type: String },
    description: { type: String },
    image: { type: String },
    price: { type: Number },
    location: { type: String },
    country: { type: String },
    reviews: [
        { type: schema.Types.ObjectId,
         ref: "Review" 
        }],
    owner:{
      type:schema.Types.ObjectId,
      ref:"User"
    }

}); 

// Delete all reviews associated with the listing
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing.reviews.length) {  
  await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;