const mongoose = require('mongoose');
const schema = mongoose.Schema;

const listingSchema = new schema({
    title: { type: String },
    description: { type: String },
    image: {
        type: String
    },
    price: { type: Number },
    location: { type: String },
    country: { type: String }

});

module.exports = mongoose.model('Listing',listingSchema);