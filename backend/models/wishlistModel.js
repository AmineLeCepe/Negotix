const mongoose = require('mongoose');
const userModel = require("./userModel");

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    auctions: {
        // Stores an array of exclusively auction IDs
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        default: [],
    },
});

// Check if model already exists in database, otherwise create it
const wishlistModel = mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);

module.exports = userModel;