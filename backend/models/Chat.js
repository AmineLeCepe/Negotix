/*Chat:
- id (primary key)
- auctionId (foreign key references auctions)
- userId (foreign key references users) (not required)*/

const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({
     auctionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Auction',
        required: true,
     },
     userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
     },
})

// Check if model already exists in database, otherwise create it
const chatModel = mongoose.models.Chat || mongoose.model("Chat", chatSchema);

module.exports = chatModel;