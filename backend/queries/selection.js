const Auction = require('../models/auctionModel');
const Category = require('../models/categoryModel');
const mongoose = require('mongoose');
const Bid = require('../models/bidModel');

// Gets all auctions from the database
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

// Gets the most recent auctions from the database
async function getRecentAuctions() {
    try {
        return await Auction.find()
            .populate({
                path: 'categoryId',
                select: 'name'
            })
            .sort({ creationDate: -1 })
            .limit(2);
    } catch (e) {
        console.error(e);
        return [];
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
        const existingBid = await Bid.findOne({ userId, auctionId });

        const auction = await Auction.findById(auctionId);
        if (!auction) {
            console.log("Auction not found.");
            return null;
        }

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



module.exports = {
    getAllAuctions,
    getRecentAuctions,
    getAuctionsCategoryCount,
    newBid,
};