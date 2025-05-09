<<<<<<< HEAD
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
const { getAllAuctions, getActiveAuctions, getRecentAuctions, getAuctionsCategoryCount, newBid, getRunningAuctionsForUser,
    getAllAuctionsForUser, getUserById, getCompletedUnpaidAuctionsForUser, getBidByUserId
} = require('./queries/selection');
const { insertAuctionTemplate2 } = require('./queries/insertion');

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

   // Add to your server.js
   const cartCache = new Map(); // Simple in-memory cache
   const CACHE_TTL = 60000; // 1 minute in milliseconds
   
   app.use(async (req, res, next) => {
       if (req.isAuthenticated() && req.user) {
           const userId = req.user._id.toString();
           const now = Date.now();
           
           // Check if we have a valid cached result
           if (cartCache.has(userId) && now - cartCache.get(userId).timestamp < CACHE_TTL) {
               res.locals.cartItems = cartCache.get(userId).items;
           } else {
               // Cache miss or expired cache, fetch new data
               const cartItems = await getCompletedUnpaidAuctionsForUser(req.user._id);
               res.locals.cartItems = cartItems;
               
               // Update cache
               cartCache.set(userId, {
                   items: cartItems,
                   timestamp: now
               });
               
               // Only log on actual data fetches
               console.log(`Middleware: Found ${cartItems.length} cart items for user ${req.user.username}`);
           }
       } else {
           // For non-authenticated users, set empty cart
           res.locals.cartItems = [];
       }
       next();
   });

// API endpoints
/// GET requests
app.get('/', async (req, res) => {
    try {
        const recentAuctions = await getRecentAuctions();
        res.render('main-page', {
            title: 'Home',
            recentAuctions: recentAuctions,
            isHomePage: true,
        })
    } catch (error) {
        console.error(error);
        res.status(500).render('error', {
            message: 'Error loading main page',
            error: error
        });
    }
})
app.get('/listings', async (req, res) => {
    // This is sample data - you would typically fetch this from your database
    try {
        const items = await getActiveAuctions();
        const recentItems = await getRecentAuctions();
        const auctionsCategoryCount = await getAuctionsCategoryCount();
        const cartItems = await getCompletedUnpaidAuctionsForUser(req.user?._id);
        // Render the EJS template and pass the item array
        res.render('listings', {
            items: items,
            recentItems: recentItems,
            title: 'Listings',
            categories: auctionsCategoryCount,
            cartItems: cartItems,
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', {
            message: 'Error loading listings',
            error: error
        });
    }
});
app.get('/profile', async (req, res) => {
    // Get userId from query parameter, fallback to logged-in user if not provided
    const userId = req.query.userId || (req.user ? req.user._id : null);
    
    // If no userId is available (not logged in and no query param)
    if (!userId) {
        return res.redirect('/login'); // Redirect to login page
    }
    
    // Get user by ID
    const user = await getUserById(userId);
    
    // If user not found, redirect to 404 page
    if (!user) {
        return res.status(404).redirect('/404');
    }
    
    // Get auctions for the specified user
    const runningAuctions = await getRunningAuctionsForUser(userId);
    const allAuctions = await getAllAuctionsForUser(userId);
    
    // Check if the profile being viewed belongs to the logged-in user
    const isOwnProfile = req.user ? user._id.toString() === req.user._id.toString() : false;
    
    res.render('profil', {
        title: 'Profile',
        user: user,
        runningAuctions: runningAuctions,
        allAuctions: allAuctions,
        isOwnProfile: isOwnProfile,
        currentUser: req.user
    });
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
app.get('/my-bids', checkAuthenticated, (req, res) => {
    res.render('my-bids', { title: 'My Bids', user: req.user });
}); // TODO
app.get('/checkout', checkAuthenticated, async (req, res) => {
    const cartItems = await getCompletedUnpaidAuctionsForUser(req.user?._id);

    res.render('checkout', { title: 'Checkout', user: req.user, cartItems: cartItems });
});
app.get('/test', (req, res) => {
    res.render('test', {title: 'Test'});
})

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
                            redirectUrl: '/',
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
                            redirectUrl: '/',
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
=======
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
const { getAllAuctions, getActiveAuctions, getRecentAuctions, getAuctionsCategoryCount, newBid, getRunningAuctionsForUser,
    getAllAuctionsForUser, getUserById, getCompletedUnpaidAuctionsForUser, getBidByUserId
} = require('./queries/selection');
const { insertAuctionTemplate2 } = require('./queries/insertion');

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

   // Add to your server.js
   const cartCache = new Map(); // Simple in-memory cache
   const CACHE_TTL = 60000; // 1 minute in milliseconds
   
   app.use(async (req, res, next) => {
       if (req.isAuthenticated() && req.user) {
           const userId = req.user._id.toString();
           const now = Date.now();
           
           // Check if we have a valid cached result
           if (cartCache.has(userId) && now - cartCache.get(userId).timestamp < CACHE_TTL) {
               res.locals.cartItems = cartCache.get(userId).items;
           } else {
               // Cache miss or expired cache, fetch new data
               const cartItems = await getCompletedUnpaidAuctionsForUser(req.user._id);
               res.locals.cartItems = cartItems;
               
               // Update cache
               cartCache.set(userId, {
                   items: cartItems,
                   timestamp: now
               });
               
               // Only log on actual data fetches
               console.log(`Middleware: Found ${cartItems.length} cart items for user ${req.user.username}`);
           }
       } else {
           // For non-authenticated users, set empty cart
           res.locals.cartItems = [];
       }
       next();
   });

// API endpoints
/// GET requests
app.get('/', async (req, res) => {
    try {
        const recentAuctions = await getRecentAuctions();
        res.render('main-page', {
            title: 'Negotix',
            recentAuctions: recentAuctions,
            isHomePage: true,
        })
    } catch (error) {
        console.error(error);
        res.status(500).render('error', {
            message: 'Error loading main page',
            error: error
        });
    }
})
app.get('/listings', async (req, res) => {
    // This is sample data - you would typically fetch this from your database
    try {
        const items = await getActiveAuctions();
        const recentItems = await getRecentAuctions();
        const auctionsCategoryCount = await getAuctionsCategoryCount();
        const cartItems = await getCompletedUnpaidAuctionsForUser(req.user?._id);
        // Render the EJS template and pass the item array
        res.render('listings', {
            items: items,
            recentItems: recentItems,
            title: 'Listings',
            categories: auctionsCategoryCount,
            cartItems: cartItems,
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', {
            message: 'Error loading listings',
            error: error
        });
    }
});

app.get('/livechat/:auctionId', async (req, res) => {
    const auctionId = req.params.auctionId;
    
    const auction = await Auction.findById(auctionId);
  
    if (!auction) return res.status(404).redirect('/404');
  
    const now = new Date();
    const endTime = new Date(auction.endDate);
    const remainingTimeMs = endTime - now;

    const remainingSeconds = Math.floor(remainingTimeMs / 1000);
    const remainingMinutes = Math.floor(remainingSeconds / 60);
    const remainingHours = Math.floor(remainingMinutes / 60);
    const remainingDays = Math.floor(remainingSeconds / 84600);

  
    res.render('livechat', {
      name: auction.title,
      image: auction.image,
      endDate: auction.endDate,
      bidPrice: auction.latestPrice,
      remainingTimeMs,
      auction
    });
  });
  
app.get('/profile', async (req, res) => {
    // Get userId from query parameter, fallback to logged-in user if not provided
    const userId = req.query.userId || (req.user ? req.user._id : null);
    
    // If no userId is available (not logged in and no query param)
    if (!userId) {
        return res.redirect('/login'); // Redirect to login page
    }
    
    // Get user by ID
    const user = await getUserById(userId);
    
    // If user not found, redirect to 404 page
    if (!user) {
        return res.status(404).redirect('/404');
    }
    
    // Get auctions for the specified user
    const runningAuctions = await getRunningAuctionsForUser(userId);
    const allAuctions = await getAllAuctionsForUser(userId);
    
    // Check if the profile being viewed belongs to the logged-in user
    const isOwnProfile = req.user ? user._id.toString() === req.user._id.toString() : false;
    
    res.render('profil', {
        isProfilePage: true,
        title: 'Profile',
        user: user,
        runningAuctions: runningAuctions,
        allAuctions: allAuctions,
        isOwnProfile: isOwnProfile,
        currentUser: req.user
    });
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
app.get('/my-bids', checkAuthenticated, (req, res) => {
    res.render('my-bids', { title: 'My Bids', user: req.user });
}); // TODO
app.get('/checkout', checkAuthenticated, async (req, res) => {
    const cartItems = await getCompletedUnpaidAuctionsForUser(req.user?._id);

    res.render('checkout', { title: 'Checkout', user: req.user, cartItems: cartItems });
});
app.get('/test', (req, res) => {
    res.render('test', {title: 'Test'});
})

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
                            redirectUrl: '/',
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
                            redirectUrl: '/',
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


app.post('/place-bid', async (req, res, next) => {
    
    {console.log(req.body)};
    const { price, auctionId } = req.body;
    const userId = req.user?._id;

    try {
        const bidResult = await newBid(price, userId, auctionId);
        if(bidResult){
            return res.redirect(`/listings?success=true&message=Bid placed successfully!&auctionId=${auctionId}`);
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
>>>>>>> 867decde67b6d4f6addd0178e83ad3384b285f9b
// });