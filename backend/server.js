// Dependencies
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/mongodb');
const path = require('path');
const mongoose = require('mongoose');

// Queries imports
const { getAllAuctions, getRecentAuctions } = require('./queries/queries');


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
const {get} = require("mongoose");



// Debug
getAllAuctions().then(auctions => console.log(auctions));

// Debug
getRecentAuctions().then(auctions => console.log(auctions));
