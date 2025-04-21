// Dependencies
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/mongodb');
const path = require('path');

// Queries imports
const { getAllAuctions, getRecentAuctions } = require('./queries/selection');


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
app.get('/listings', async (req, res) => {
    // This is sample data - you would typically fetch this from your database
    try {
        const items = await getAllAuctions();
        // Render the EJS template and pass the item array
        res.render('listings', {items: items, title: 'Listings'});
    } catch (error) {
        console.error(error);
        res.status(500).render('error', {
            message: 'Error loading listings',
            error: error
        });
    }
});

app.get('/contact', (req, res) => {
    res.render('contact', {title: 'Contact'});
})

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


/* DEBUG ZONE, IGNORE */
// getAllAuctions().then(auctions => console.log(auctions));
//
// getRecentAuctions().then(auctions => console.log(auctions));


