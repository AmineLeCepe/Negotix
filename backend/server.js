// Dependencies
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/mongodb');
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session')
const validator = require('validator');

const initializePassport = require('./config/passport-config');

initializePassport(
    passport,
    async username => await User.findOne({ username: username }).exec(),
    async id => await User.findOne({ _id: id }).exec()
);

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
const { getAllAuctions, getRecentAuctions, getAuctionsCategoryCount, newBid,getWishlist } = require('./queries/selection');

const { addToWishlist } = require('./queries/insertion');


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
const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth');
}

// Middleware to check if user is not authenticated
const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        title: 'Error',
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000*60*60*24*7}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.user = req.user;
    next();
});

// API endpoints
/// GET requests
app.get('/', (req, res) => {
    res.render('index')
})
// Update your listings route to include wishlist data
app.get('/listings', async (req, res) => {
    try {
        const items = await getAllAuctions();
        const recentItems = await getRecentAuctions();
        const auctionsCategoryCount = await getAuctionsCategoryCount();
        
        // Get user's wishlist if logged in
        let wishlistItems = [];
        if (req.user) {
            wishlistItems = await getWishlist(req.user._id);
            // Extract just the IDs for easy comparison in the template
            wishlistItems = wishlistItems.map(item => item._id.toString());
        }
        
        // Render the EJS template and pass the item array
        res.render('listings', {
            items: items,
            recentItems: recentItems,
            title: 'Listings',
            categories: auctionsCategoryCount,
            user: req.user ? {
                ...req.user,
                wishlist: wishlistItems
            } : null
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
app.get('/auth', checkNotAuthenticated, (req, res) => {
    res.render('auth', { title: 'Authenticate' });
});
app.get('/profile', checkAuthenticated, (req, res) => {
    res.render('profile', { title: 'Profile', user: req.user });
}); // TODO
app.get('/my-bids', checkAuthenticated, (req, res) => {
    res.render('my-bids', { title: 'My Bids', user: req.user });
}); // TODO
app.get('/checkout', checkAuthenticated, (req, res) => {
    res.render('checkout', { title: 'Checkout', user: req.user });
});
app.get('/test', (req, res) => {
    res.render('test', {title: 'Test'});
})

app.get('/listings', (req, res) => {
    res.render('listings', { user: req.user });
});

// GET requests (admin section)
app.get('/admin', checkAuthenticated, (req, res) => {
    if (req.user && req.user.isAdmin) {
        res.render('admin', { title: 'Admin' });
    } else {
        res.redirect('/');
    }
});


/// POST requests
app.post('/auth', async (req, res, next) => {
    try {
        const {formType} = req.body;

        switch (formType) {
            case 'login':
                passport.authenticate('local', (err, user, info) => {
                    if (err) {
                        console.error('Authentication error:', err);
                        return res.status(500).json({error: 'Authentication error occurred'});
                    }

                    if (!user) {
                        // Authentication failed
                        req.flash('error', info.message);
                        return res.status(401).json({
                            success: false,
                            message: info.message || 'Invalid username or password'
                        });
                    }

                    // Inside the passport.authenticate callback in the '/auth' POST route
                    req.logIn(user, (err) => {
                        if (err) {
                            console.error('Login error:', err);
                            return res.status(500).json({
                                success: false,
                                message: 'Error during login'
                            });
                        }

                        // Return success JSON response with isAdmin included
                        return res.status(200).json({
                            success: true,
                            message: 'Login successful',
                            redirectUrl: '/listings',
                            user: {
                                id: user._id,
                                username: user.username,
                                email: user.email,
                                isAdmin: user.isAdmin
                            }
                        });
                    });
                })(req, res, next);
                break;

            case 'register': {
                const {username, email, password} = req.body;

                // Input validation
                if (!validator.isEmail(email)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid email address'
                    });
                }

                if (!password || password.length < 8) {
                    return res.status(400).json({
                        success: false,
                        message: 'Password must be at least 8 characters long'
                    });
                }

                try {
                    // Check for existing user
                    const existingUser = await User.findOne({$or: [{username}, {email}]});
                    if (existingUser) {
                        return res.status(400).json({
                            success: false,
                            message: 'Username or email already exists'
                        });
                    }

                    // Create new user
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const newUser = await User.create({
                        username,
                        email,
                        passwordHash: hashedPassword
                    });

                    // Log in using Passport
                    req.login(newUser, (err) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: 'Error during registration login'
                            });
                        }
                        return res.status(200).json({
                            success: true,
                            message: 'Registration successful',
                            redirectUrl: '/listings',
                            user: {
                                id: newUser._id,
                                username: newUser.username,
                                email: newUser.email,
                                isAdmin: newUser.isAdmin  // make sure to pass this field
                            }
                        });
                    });
                } catch (error) {
                    return res.status(500).json({
                        success: false,
                        message: 'Registration failed',
                        error: error.message
                    });
                }
                break;
            }

            default:
                return res.status(400).json({error: 'Invalid form type'});
        }
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(500).json({error: 'An error occurred during authentication'});
    }
});
app.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error during logout' });
        }
        res.redirect('/auth');
    });
});

app.post('/add-to-wishlist', async (req, res) => {
    try {
        // Debug logging
        console.log("Wishlist request body:", req.body);
        console.log("Wishlist request query:", req.query);
        console.log("Wishlist request params:", req.params);
        
        const { userId, auctionId } = req.body;
        
        if (!userId || !auctionId) {
            console.error("Missing data - userId:", userId, "auctionId:", auctionId);
            return res.status(400).json({ 
                success: false, 
                message: 'Missing user ID or auction ID' 
            });
        }
        
        const result = await addToWishlist(userId, auctionId);
        
        // Use the action to determine the message
        const message = result.action === 'added' 
            ? 'Item added to wishlist' 
            : 'Item removed from wishlist';
            
        // Return JSON instead of redirect for AJAX
        return res.status(200).json({
            success: true,
            message: message,
            action: result.action
        });
    } catch (error) {
        console.error("Error updating wishlist:", error);
        return res.status(500).json({
            success: false,
            message: 'Error updating wishlist',
            error: error.message
        });
    }
});

app.post('/place-bid', async (req, res, next) => {
    
    {console.log(req.body)};
    const { price, auctionId } = req.body;
    const userId = req.user?._id;

    try {
        const bidResult = await newBid(price, userId, auctionId);
        if(bidResult){
            return res.redirect(`/listings?success=true&message=Bid placed successfully!`);
        } else {
           return res.redirect(`/listings?success=false&message=Bid not accepted. Must be at least 500 DA higher than your previous bid or starting price.`);
      }} catch (err) {
        console.error(err);
       return res.redirect(`/listings?success=false&message=Error processing bid`);
      }
    });
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

// getAllAuctions().then(auctions => console.log(auctions));

// Console log logged in user on every request
// app.use((req, res, next) => {
//     if (req.isAuthenticated()) {
//         console.log("User from session:", req.user);
//     }
//     next();
// });