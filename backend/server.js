// Dependencies
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/mongodb');
const path = require('path');
const bcrypt = require('bcrypt');

// Database imports
const mongoose = require("mongoose");

const User = require('./models/userModel');
const Auction = require('./models/auctionModel');
const Bid = require('./models/bidModel');
const Chat = require('./models/chatModel');
const Message = require('./models/messageModel');
const Wishlist = require('./models/wishlistModel');
const Review = require('./models/reviewModel');
const Category = require('./models/categoryModel');

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
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API endpoints
/// GET requests
app.get('/listings', async (req, res) => {
    // This is sample data - you would typically fetch this from your database
    try {
        const items = await getAllAuctions();
        const recentItems = await getRecentAuctions();
        // Render the EJS template and pass the item array
        res.render('listings', {
            items: items,
            recentItems: recentItems,
            title: 'Listings'
        });
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
app.get('/FAQ', (req, res) => {
  res.render('faq', {title: 'FAQ'});
})
app.get('/return-policy', (req, res) => {
  res.render('return-policy', {title: 'Return Policy'});
})
app.get('/bidding', (req, res) => {
  res.render('bidding', {title: 'Bidding'});
})
app.get('/privacy-policy', (req, res) => {
  res.render('privacy-policy', {title: 'Privacy Policy'});
})
app.get('/track', (req, res) => {
  res.render('track', {title: 'Track'});
})
app.get('/about', (req, res) => {
  res.render('about', {title: 'About Us'});
})
app.get('/shipping', (req, res) => {
  res.render('shipping', {title: 'Shipping'});
})
app.get('/terms', (req, res) => {
  res.render('terms', {title: 'Terms and Conditions'});
})
app.get('/auth', (req, res) => {
    res.render('auth', {title: 'Authenticate'});
})
app.get('/test', (req, res) => {
    res.render('test', {title: 'Test'});
})

/// POST requests
app.post('/auth', async (req, res) => {
    const { formType } = req.body;

    if (formType === 'login') {
        console.log(req.body); /* Debug line */
        const { username, password } = req.body;
        try {
            const user = await User.findOne({
                username: username
            }).exec()

            const isPasswordValid = user ? await bcrypt.compare(password, user.passwordHash): false;


            if (isPasswordValid) {
                console.log('Login successful');
            } else {
                console.log('Login failed');
            }
        } catch (e) {
            console.error(e);
        }
    }

    if (formType === 'register') {
        console.log(req.body); /* Debug line */
        const { username, email, password } = req.body;
        try {
            const user = await User.findOne({
                username: username,
                email: email
            }).exec()

            if (!user) {
                const hashedPassword = await bcrypt.hash(password, 10);
                try {
                    await User.create({
                        username: username,
                        email: email,
                        passwordHash: hashedPassword,
                    }).then(user => console.log('User created successfully'));
                } catch (e) {
                    console.error(e);
                }
            } else {
                console.log('User already exists');
            }
        } catch (e) {
            console.error(e);
        }
    }

    if (formType === 'forgotPassword') {
        const { email } = req.body;
        return res.send(`Sending password reset link to ${email}`);
    }
    res.status(400).send('Unknown form submission');
});

// Route to use when frontend team adds new pages


// 404 route
app.use((req, res) => {
    res.status(404).render('404', {
        title: '404 - Page Not Found',
        message: 'The page you are looking for does not exist.'
    });
});


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})

/* DEBUG ZONE, IGNORE */
// const { insertAuction } = require('./queries/insertion');
// insertAuction().then(auction => console.log(auction));
// getAllAuctions().then(auctions => console.log(auctions));
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


 