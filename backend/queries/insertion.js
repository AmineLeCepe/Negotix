const Auction = require('../models/auctionModel');
const Category = require('../models/categoryModel');
const Wishlist = require('../models/wishlistModel');
const mongoose = require('mongoose');

async function insertAuctionTemplate1() {
    try {
        Auction.insertMany([
            {
                sellerId: new mongoose.Types.ObjectId('68050461ac9df5ecce3c9efe'),
                title: 'Darius the great',
                description: 'Placeholder description',
                categoryId: new mongoose.Types.ObjectId('68050799f736f109eaf6a2a0'),
                creationDate: new Date(),
                startingPrice: 9000,
                latestPrice: 9000,
                endDate: new Date('2025-05-15'),
                isCompleted: false,
                image: "https://cdn.discordapp.com/attachments/1355619011202777240/1363932879893037307/shoes1.webp?ex=6807d4fb&is=6806837b&hm=936805bcf5c62c7537918a539ed12da9cdbf6e8673f9cb0d73573f1b98c12670&"
            },
            {
                sellerId: new mongoose.Types.ObjectId('68050461ac9df5ecce3c9efe'),
                title: 'Nike Airmax',
                description: 'Placeholder description',
                categoryId: new mongoose.Types.ObjectId('68050799f736f109eaf6a2a0'),
                creationDate: new Date(),
                startingPrice: 9000,
                latestPrice: 9000,
                endDate: new Date('2025-05-15'),
                isCompleted: false,
                image: "https://cdn.discordapp.com/attachments/1355619011202777240/1363932868534866030/shoes2_1.webp?ex=6807d4f8&is=68068378&hm=f726353c659370744fd8479876bbda7740a48f876dfb8d5ff3eb6deb2187b38b&"
            },
        ])
    } catch (e) {
        console.error(e);
    }
}

async function insertAuctionTemplate2() {
    try {
        Auction.insertMany([
            {
                sellerId: new mongoose.Types.ObjectId('680d006c4de40da91edf83a4'),
                title: 'Jeff the land shark',
                description: 'Mrrrrrr',
                categoryId: new mongoose.Types.ObjectId('68050799f736f109eaf6a29c'),
                creationDate: Date.now(),
                startingPrice: 9000,
                latestPrice: 9000,
                endDate: new Date('2025-05-21'),
                isPaidFor: false,
                isCompleted: false,
                image: "https://cdn.discordapp.com/attachments/1155177309880459309/1369703897479909449/jeff_the_land_shar.png?ex=681cd3a9&is=681b8229&hm=faa08c93fe22a9c09094d2a9cdb3dc598d8c67434c65d86fa4780871d955abe8&"
            }
        ]);
    } catch (e) {
        console.error(e);
    }
}

async function insertCategory() {
    try {
        Category.insertMany([
            { name: 'Electronics' },
            { name: 'Sport Equipments' },
            { name: 'Decor' },
            { name: 'Accessories' },
            { name: 'Mobile' },
            { name: 'Watches' },
            { name: 'Clothes' },
            { name: 'Furnitures' },
            { name: 'Office' },
            { name: 'Cosmetics' },
        ])
    } catch (e) {
        console.error(e);
    }
}

async function addToWishlist(userId, auctionId) {
    try {
        // Convert strings to ObjectId if needed
        const userObjId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
        const auctionObjId = typeof auctionId === 'string' ? new mongoose.Types.ObjectId(auctionId) : auctionId;
        
        // Check if user already has a wishlist
        let wishlist = await Wishlist.findOne({ userId: userObjId });
        
        if (wishlist) {
            // Check if auction is already in wishlist to avoid duplicates
            if (!wishlist.auctions.includes(auctionObjId)) {
                // Add auction to existing wishlist
                wishlist.auctions.push(auctionObjId);
                await wishlist.save();
            }
        } else {
            // Create new wishlist for user
            wishlist = new Wishlist({
                userId: userObjId,
                auctions: [auctionObjId]
            });
            await wishlist.save();
        }
        
        return wishlist;
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        throw error;
    }
}

module.exports = { insertAuctionTemplate1, insertCategory, addToWishlist, insertAuctionTemplate2 };