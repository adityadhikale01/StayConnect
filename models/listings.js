import mongoose from 'mongoose';


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
        }]

});

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;