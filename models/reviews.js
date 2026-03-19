import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    
    comment:{ type: String, required: true },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    CreatedAt: {
        type: Date,
        default: Date.now(),
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;