const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    auctionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction',
        required: true,
    },
    stars: {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: 'Must be an integer'
        },
        min: 0,
        max: 5,
    },
    content: {
        type: String,
        maxlength: 3000,
    },
});

// Check if model already exists in database, otherwise create it
const reviewModel = mongoose.models.Review || mongoose.model("Review", reviewSchema);

module.exports = reviewModel;