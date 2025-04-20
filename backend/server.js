const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/mongodb');
const path = require('path');


// App config
const app = express();
const port = process.env.PORT || 3000;
connectDB();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Middlewares
app.use(express.json());
app.use(cors());

// API endpoints
app.get('/listings', (req, res) => {
    // This is sample data - you would typically fetch this from your database
    const items = [
        {
            id: 1,
            name: "Test",
            price: "2400 DA",
            image: "https://cdn.discordapp.com/attachments/1355619011202777240/1363499695988539504/shirt.webp?ex=6806418c&is=6804f00c&hm=4d6d2ddc3aa9f984e5efaf87c558bfd4c6f29afea7b8b565fa4593275ecc7dfd&",
            timeLeft: "4m 5s"
        },
        {
            id: 2,
            name: "XXXXXXXX",
            price: "2400 DA",
            image: "https://cdn.discordapp.com/attachments/1355619011202777240/1363499695988539504/shirt.webp?ex=6806418c&is=6804f00c&hm=4d6d2ddc3aa9f984e5efaf87c558bfd4c6f29afea7b8b565fa4593275ecc7dfd&",
            timeLeft: "21m 7s"
        },
        {
            id: 3,
            name: "XXXXXXXX",
            price: "2400 DA",
            image: "https://cdn.discordapp.com/attachments/1355619011202777240/1363499695988539504/shirt.webp?ex=6806418c&is=6804f00c&hm=4d6d2ddc3aa9f984e5efaf87c558bfd4c6f29afea7b8b565fa4593275ecc7dfd&",
            timeLeft: "30m 10s"
        },
        {
            id: 4,
            name: "XXXXXXXX",
            price: "2400 DA",
            image: "https://cdn.discordapp.com/attachments/1355619011202777240/1363499695988539504/shirt.webp?ex=6806418c&is=6804f00c&hm=4d6d2ddc3aa9f984e5efaf87c558bfd4c6f29afea7b8b565fa4593275ecc7dfd&",
            timeLeft: "41m 1s"
        },
        {
            id: 5,
            name: "XXXXXXXX",
            price: "2400 DA",
            image: "https://cdn.discordapp.com/attachments/1355619011202777240/1363499695988539504/shirt.webp?ex=6806418c&is=6804f00c&hm=4d6d2ddc3aa9f984e5efaf87c558bfd4c6f29afea7b8b565fa4593275ecc7dfd&",
            timeLeft: "20m 3s"
        },
        {
            id: 6,
            name: "XXXXXXXX",
            price: "2400 DA",
            image: "https://cdn.discordapp.com/attachments/1355619011202777240/1363499695988539504/shirt.webp?ex=6806418c&is=6804f00c&hm=4d6d2ddc3aa9f984e5efaf87c558bfd4c6f29afea7b8b565fa4593275ecc7dfd&",
            timeLeft: "11m 8s"
        },
        {
            id: 7,
            name: "XXXXXXXX",
            price: "2400 DA",
            image: "https://cdn.discordapp.com/attachments/1355619011202777240/1363499695988539504/shirt.webp?ex=6806418c&is=6804f00c&hm=4d6d2ddc3aa9f984e5efaf87c558bfd4c6f29afea7b8b565fa4593275ecc7dfd&",
            timeLeft: "15m 5s"
        },
        {
            id: 8,
            name: "XXXXXXXX",
            price: "2400 DA",
            image: "https://cdn.discordapp.com/attachments/1355619011202777240/1363499695988539504/shirt.webp?ex=6806418c&is=6804f00c&hm=4d6d2ddc3aa9f984e5efaf87c558bfd4c6f29afea7b8b565fa4593275ecc7dfd&",
            timeLeft: "30m 8s"
        },
        {
            id: 9,
            name: "XXXXXXXX",
            price: "2400 DA",
            image: "https://cdn.discordapp.com/attachments/1355619011202777240/1363499695988539504/shirt.webp?ex=6806418c&is=6804f00c&hm=4d6d2ddc3aa9f984e5efaf87c558bfd4c6f29afea7b8b565fa4593275ecc7dfd&",
            timeLeft: "30m 8s"
        }
    ];

    // Render the EJS template and pass the items array
    res.render('listings', { items: items, title: 'Listings' });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})

// Run queries manually
const mongoose = require("mongoose");

const User = require('./models/userModel');
const Auction = require('./models/auctionModel');
const Bid = require('./models/bidModel');
const Chat = require('./models/chatModel');
const Message = require('./models/messageModel');
const Wishlist = require('./models/wishlistModel');
const Review = require('./models/reviewModel');
const Category = require('./models/categoryModel');

// async function insertAuction() {
//     try {
//         Auction.insertMany([
//             {
//                 sellerId: new mongoose.Types.ObjectId('68050461ac9df5ecce3c9efe'),
//                 title: 'Test',
//                 description: 'Placeholder description',
//                 categoryId: new mongoose.Types.ObjectId('68050799f736f109eaf6a2a0'),
//                 creationDate: new Date(),
//                 startingPrice: 1000,
//                 latestPrice: 1000,
//                 endDate: new Date('2025-05-20'),
//                 isCompleted: false,
//             },
//             {
//                 sellerId: new mongoose.Types.ObjectId('68050461ac9df5ecce3c9efe'),
//                 title: 'Test',
//                 description: 'Placeholder description',
//                 categoryId: new mongoose.Types.ObjectId('68050799f736f109eaf6a2a0'),
//                 creationDate: new Date(),
//                 startingPrice: 1000,
//                 latestPrice: 1000,
//                 endDate: new Date('2025-05-20'),
//                 isCompleted: false,
//             },
//             {
//                 sellerId: new mongoose.Types.ObjectId('68050461ac9df5ecce3c9efe'),
//                 title: 'Test',
//                 description: 'Placeholder description',
//                 categoryId: new mongoose.Types.ObjectId('68050799f736f109eaf6a2a0'),
//                 creationDate: new Date(),
//                 startingPrice: 1000,
//                 latestPrice: 1000,
//                 endDate: new Date('2025-05-20'),
//                 isCompleted: false,
//             },
//             {
//                 sellerId: new mongoose.Types.ObjectId('68050461ac9df5ecce3c9efe'),
//                 title: 'Test',
//                 description: 'Placeholder description',
//                 categoryId: new mongoose.Types.ObjectId('68050799f736f109eaf6a2a0'),
//                 creationDate: new Date(),
//                 startingPrice: 1000,
//                 latestPrice: 1000,
//                 endDate: new Date('2025-05-20'),
//                 isCompleted: false,
//             }
//         ])
//     } catch (e) {
//         console.error(e);
//     }
// }
//
// insertAuction();
//
// async function insertCategory() {
//     try {
//         Category.insertMany([
//             { name: 'Electronics' },
//             { name: 'Sport Equipments' },
//             { name: 'Decor' },
//             { name: 'Accessories' },
//             { name: 'Mobile' },
//             { name: 'Watches' },
//             { name: 'Clothes' },
//             { name: 'Furnitures' },
//             { name: 'Office' },
//             { name: 'Cosmetics' },
//         ])
//     } catch (e) {
//         console.error(e);
//     }
// }
//
// insertCategory();

// routes/productRoutes.js or similar

const counter = express.Router();

// Get counts
counter.get('/counts', async (req, res) => {
    try {
        const totalCount = await Auction.countDocuments();

        const categoryCounts = await Auction.aggregate([
            {
                $group: {
                    _id: '$Category',
                    count: { $sum: 1 }
                }
            }
        ]);

        // format it to an object, extra
        const formattedCounts = {};
        categoryCounts.forEach(item => {
            formattedCounts[item._id] = item.count;
        });

        //connect to the frontend
        res.json({
            total: totalCount,
            categories: formattedCounts
        });

        //catch errors
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch counts' });
    }
});

module.exports = counter;
/*
async function getAllAuctions() {
    const auctions = await Auction.find();
    return auctions;
}

getAllAuctions().then(auctions => console.log(auctions));
*/

//latest 2 added items

counter.get('/latest', async (req, res) => {
    try {
        const latestItems = await Auction.find() //fetch the items
            .sort({ creationDate: -1 }) // sort by newest
            .limit(2);

        res.status(200).json(latestItems);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

//get all prodcuts

counter.get('/all', async (req, res) => {
    try {
        const allItems = await Auction.find(); //get everything
        res.status(200).json(allItems);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});


