const Auction = require('../models/auctionModel');
const Category = require('../models/categoryModel');
const mongoose = require('mongoose');

// Gets all auctions from the database
async function getAllAuctions() {
    try {
        return await Auction.find();
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Gets the most recent auctions from the database
async function getRecentAuctions() {
    try {
        return await Auction.find() //fetch the items
            .sort({ creationDate: -1 }) // sort by newest
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


module.exports = {
    getAllAuctions,
    getRecentAuctions,
    getAuctionsCategoryCount,
};