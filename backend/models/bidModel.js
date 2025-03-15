/* Bid:
- id (primary key)
- auctionId (foreign key references auctions)
- userId (foreign key references users)
- amount
- isAnonymous (bool)
- creationDate
 Bid:
- amount cannot be lower than currentPrice AND startingPrice on same auction*/

const mongoose = require("mongoose")

const bidSchema= new mongoose.Schema({
    auctionId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Auction',
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User',
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
        max: 2147483647, // Upper integer limit
    },
    isAnonymous:{
        type: Boolean,
        required: true,
        default: false,
    },
    creationDate:{
        type: Date,
        required: true,
        default: () => Date.now(),
        immutable: true,
    },

})

// Check if model already exists in database, otherwise create it
const bidModel = mongoose.models.Bid || mongoose.model("Bid", bidSchema);

module.exports = bidModel;