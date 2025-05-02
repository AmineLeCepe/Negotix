const Auction = require('../models/auctionModel');
const Category = require('../models/categoryModel');
const mongoose = require('mongoose');

async function insertAuction() {
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

module.exports = { insertAuction, insertCategory };