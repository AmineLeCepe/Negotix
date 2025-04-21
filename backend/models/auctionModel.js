const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
    sellerId: {
        // References the user model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    highestBidId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid',
    },
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
    },
    description: {
        type: String,
        maxlength: 3000,
    },
    image: {
      type: String,
      required: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    creationDate: {
        required: true,
        type: Date,
        immutable: true,
        default: () => Date.now,
    },
    startingPrice: {
        type: Number,
        required: true,
        min: 0,
        max: 2147483647 // Upper integer limit
    },
    latestPrice: {
        type: Number,
        min: 0,
        max: 2147483647 // Upper integer limit
    },
    endDate: {
        type: Date,
    },
    isCompleted: {
        type: Boolean,
        default: false,
        required: true,
    }
});

// Check if model already exists in database, otherwise create it
const auctionModel = mongoose.models.Auction || mongoose.model("Auction", auctionSchema);

module.exports = auctionModel;