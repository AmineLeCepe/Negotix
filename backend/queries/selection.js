const Auction = require('../models/auctionModel');
const Category = require('../models/categoryModel');
const mongoose = require('mongoose');
const Bid = require('../models/bidModel');
const Wishlist = require('../models/wishlistModel');
const User = require('../models/userModel');


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

async function getCompletedUnpaidAuctionsForUser(userId) {
    try {
        // Convert string ID to ObjectId if needed
        const userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
        
        console.log('Searching for completed unpaid auctions for user ID:', userObjectId);
        
        // Method 1: Check if user is directly the winner (if winnerId is set)
        let completedUnpaidAuctions = [];
        
        if (mongoose.model('Auction').schema.paths.winnerId) {
            // If the auction schema has a winnerId field, use it directly
            completedUnpaidAuctions = await Auction.find({
                winnerId: userObjectId,
                isCompleted: true,
                isPaidFor: false
            })
            .populate('categoryId')
            .populate('highestBidId')
            .populate('sellerId');
        }
        
        // Method 2: Check if user's bid is the highest bid
        // First, find all bids by this user
        const userBids = await Bid.find({ userId: userObjectId });
        // console.log('User bids found:', userBids.length);
        
        if (userBids.length === 0 && completedUnpaidAuctions.length === 0) {
            // console.log('No bids or direct wins found for this user');
            return [];
        }
        
        // Extract the bid IDs
        const userBidIds = userBids.map(bid => bid._id);
        
        // Find all auctions where one of user's bids is the highest bid
        const bidWonAuctions = await Auction.find({
            highestBidId: { $in: userBidIds },
            isCompleted: true,
            isPaidFor: false
        })
        .populate('categoryId')
        .populate('highestBidId')
        .populate('sellerId');
        
        // Combine results, removing duplicates
        if (bidWonAuctions.length > 0) {
            const seenIds = new Set(completedUnpaidAuctions.map(a => a._id.toString()));
            
            for (const auction of bidWonAuctions) {
                if (!seenIds.has(auction._id.toString())) {
                    completedUnpaidAuctions.push(auction);
                }
            }
        }
        
        console.log('Found completed unpaid auctions where user is winner:', completedUnpaidAuctions.length);
        
        return completedUnpaidAuctions;
    } catch (error) {
        console.error('Error fetching completed unpaid auctions for user:', error);
        return [];
    }
}

async function getBidsByUserId(userId) {
    try {
        // Convert string ID to ObjectId if needed
        const userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
        
        // Find all bids by this user
        const bids = await Bid.find({ userId: userObjectId })
            .populate('auctionId') // Populate auction information
            .sort({ creationDate: -1 }); // Sort by creation date (newest first)
        
        if (bids.length === 0) {
            console.log('No bids found for user ID:', userObjectId);
            return [];
        }
        
        return bids;
    } catch (error) {
        console.error('Error fetching bids for user:', error);
        return [];
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
        const user = await User.findById(userObjId);
        
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
    getRunningAuctionsForUser,
    getUserById,
    getCompletedUnpaidAuctionsForUser,
    getBidsByUserId,
};