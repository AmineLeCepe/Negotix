const Auction = require('../models/auctionModel');
const Category = require('../models/categoryModel');
const mongoose = require('mongoose');

async function insertAuction() {
    try {
        Auction.insertMany([
            {
                sellerId: new mongoose.Types.ObjectId('68050461ac9df5ecce3c9efe'),
                title: 'Test',
                description: 'Placeholder description',
                categoryId: new mongoose.Types.ObjectId('68050799f736f109eaf6a2a0'),
                creationDate: new Date(),
                startingPrice: 1000,
                latestPrice: 1000,
                endDate: new Date('2025-05-20'),
                isCompleted: false,
            },
            {
                sellerId: new mongoose.Types.ObjectId('68050461ac9df5ecce3c9efe'),
                title: 'Test',
                description: 'Placeholder description',
                categoryId: new mongoose.Types.ObjectId('68050799f736f109eaf6a2a0'),
                creationDate: new Date(),
                startingPrice: 1000,
                latestPrice: 1000,
                endDate: new Date('2025-05-20'),
                isCompleted: false,
            },
            {
                sellerId: new mongoose.Types.ObjectId('68050461ac9df5ecce3c9efe'),
                title: 'Test',
                description: 'Placeholder description',
                categoryId: new mongoose.Types.ObjectId('68050799f736f109eaf6a2a0'),
                creationDate: new Date(),
                startingPrice: 1000,
                latestPrice: 1000,
                endDate: new Date('2025-05-20'),
                isCompleted: false,
            },
            {
                sellerId: new mongoose.Types.ObjectId('68050461ac9df5ecce3c9efe'),
                title: 'Test',
                description: 'Placeholder description',
                categoryId: new mongoose.Types.ObjectId('68050799f736f109eaf6a2a0'),
                creationDate: new Date(),
                startingPrice: 1000,
                latestPrice: 1000,
                endDate: new Date('2025-05-20'),
                isCompleted: false,
            }
        ])
    } catch (e) {
        console.error(e);
    }
}

insertAuction();

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

insertCategory();

module.exports = { insertAuction, insertCategory };