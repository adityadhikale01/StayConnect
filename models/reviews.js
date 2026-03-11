import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
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
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;