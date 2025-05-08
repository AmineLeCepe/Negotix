const Auction = require('../models/auctionModel');
const Category = require('../models/categoryModel');
const mongoose = require('mongoose');
const Bid = require('../models/bidModel');
const Wishlist = require('../models/wishlistModel');


async function getAllAuctions() {
    try {
        return await Auction.find()
            .populate({
                path: 'categoryId',
                select: 'name'
            });
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function getRecentAuctions() {
    try {
        return await Auction.find()
            .populate({
                path: 'categoryId',
                select: 'name'
            })
            .sort({ creationDate: -1 })
            .limit(3);
    } catch (e) {
        console.error(e);
        return [];
    }
}

async function getAllAuctionsForUser(userId) {
    try {
        // Find all auctions where the specified user is the seller
        const auctions = await Auction.find({
            sellerId: userId
        })
        .populate('categoryId', 'name') // Populate category information
        .populate('highestBidId') // Populate highest bid information
        .sort({ creationDate: -1 }); // Sort by creation date (newest first)
        
        return auctions;
    } catch (error) {
        console.error('Error fetching auctions for user:', error);
        throw error;
    }
}

async function getRunningAuctionsForUser(userId) {
    try {
        // Find all active auctions where the specified user is the seller
        const runningAuctions = await Auction.find({
            sellerId: userId,
            isCompleted: false,
            endDate: { $gt: new Date() } // Ensure the end date is in the future
        })
        .populate('categoryId', 'name') // Populate category information
        .populate('highestBidId') // Populate highest bid information if needed
        .sort({ endDate: 1 }); // Sort by end date (soonest ending first)
        
        return runningAuctions;
    } catch (error) {
        console.error('Error fetching running auctions for user:', error);
        throw error;
    }
}

async function getAuctionsCategoryCount() {
    try {
        const currentDate = new Date();
        const result = await Category.aggregate([
            {
                $lookup: {
                    from: "auctions",
                    localField: "_id",
                    foreignField: "categoryId",
                    pipeline: [
                        {
                            $match: {
                                $and: [
                                    { isCompleted: false },
                                    { endDate: { $gt: currentDate } }
                                ]
                            }
                        }
                    ],
                    as: "auctions"
                }
            },
            {
                $project: {
                    category: "$name",
                    numberOfAuctions: { $size: "$auctions" }
                }
            }
        ]);

        // Debug log
        // console.log('Current date:', currentDate);
        // console.log('Query result:', JSON.stringify(result, null, 2));

        return result;

    } catch (error) {
        console.error('Error in getAuctionsCategoryCount:', error);
        return [];
    }
}

async function newBid(price, userId, auctionId) {
    try {

        if (!userId || !auctionId) {
            console.log("Missing user or auction information.");
            return null;
        }        
        const auction = await Auction.findById(auctionId);
            if(!auction){
            console.log("Auction cannot be found.");
            return null;
        }

        
        const existingBid = await Bid.findOne({ userId, auctionId });

        const startingPrice = auction.startingPrice;

        

        if (!existingBid) {
            if(price >= startingPrice){
                const newBid = await Bid.create({userId, auctionId, amount : price})
                console.log("You have never set a bid for this auction, a new one has been created.");
                return newBid;
            }
          else {
            console.log("Initial bid must be higher than the starting price.");
            return null;
        }
        }

        const newPrice = existingBid.amount;

        if (price - newPrice >= 500) {
            existingBid.amount = price;
            await existingBid.save();
            await Auction.findByIdAndUpdate(auctionId , {latestPrice: price});
            console.log("Bid updated successfully.");
            return existingBid;
        } else {
            console.log("New price should be at least 500 DA higher than the previous bid.");
            return null;
        }

    } catch (error) {
        console.error("Error updating bid:", error);
        return null;
    }
}

async function getWishlist(userId) {
    try {
        // Convert string to ObjectId if needed
        const userObjId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
        
        // Find the user's wishlist and populate the auction details
        const wishlist = await Wishlist.findOne({ userId: userObjId })
            .populate({
                path: 'auctions',
                model: 'Auction',
                populate: {
                    path: 'categoryId',
                    select: 'name'
                }
            });
        
        // If no wishlist found, return empty array
        if (!wishlist) {
            return [];
        }
        
        return wishlist.auctions;
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return [];
    }
}

async function getActiveAuctions() {
    try {
        const currentDate = new Date();
        
        return await Auction.find({
            isCompleted: false,
            endDate: { $gt: currentDate }
        }).populate({
            path: 'categoryId',
            select: 'name'
        });
    } catch (error) {
        console.error("Error fetching active auctions:", error);
        return [];
    }
}

async function getUserById(userId) {
    try {
        // Convert string to ObjectId if needed
        const userObjId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
        
        // Find the user by ID
        const user = await userModel.findById(userObjId);
        
        // Return null if user not found
        if (!user) {
            return null;
        }
        
        return user;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
}

module.exports = {
    getAllAuctions,
    getRecentAuctions,
    getAuctionsCategoryCount,
    newBid,
    getWishlist,
    getActiveAuctions,
    getAllAuctionsForUser,
    getRunningAuctionsForUser
};