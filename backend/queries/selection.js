const Auction = require('../models/auctionModel');
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
        return await Auction.aggregate([{
            $group: {
                _id: '$Category',
                count: { $sum: 1 }
            }
        }
        ]);;
    } catch (error) {
        console.error(error);
        return [];
    }
}

module.exports = {
    getAllAuctions,
    getRecentAuctions,
    getAuctionsCategoryCount,
};