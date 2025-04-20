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
            name: "XXXXXXXX",
            price: "2400 DA",
            image: "assets/shirt.webp",
            timeLeft: "4m 5s"
        },
        {
            id: 2,
            name: "XXXXXXXX",
            price: "2400 DA",
            image: "assets/shirt.webp",
            timeLeft: "21m 7s"
        },
        {
            id: 3,
            name: "XXXXXXXX",
            price: "2400 DA",
            image: "assets/shirt.webp",
            timeLeft: "30m 10s"
        },
        {
            id: 4,
            name: "XXXXXXXX",
            price: "2400 DA",
            image: "assets/shirt.webp",
            timeLeft: "41m 1s"
        },
        {
            id: 5,
            name: "XXXXXXXX",
            price: "2400 DA",
            image: "assets/shirt.webp",
            timeLeft: "20m 3s"
        },
        {
            id: 6,
            name: "XXXXXXXX",
            price: "2400 DA",
            image: "assets/shirt.webp",
            timeLeft: "11m 8s"
        },
        {
            id: 7,
            name: "XXXXXXXX",
            price: "2400 DA",
            image: "assets/shirt.webp",
            timeLeft: "15m 5s"
        },
        {
            id: 8,
            name: "XXXXXXXX",
            price: "2400 DA",
            image: "assets/shirt.webp",
            timeLeft: "30m 8s"
        },
        {
            id: 9,
            name: "XXXXXXXX",
            price: "2400 DA",
            image: "assets/shirt.webp",
            timeLeft: "30m 8s"
        }
    ];

    // Render the EJS template and pass the items array
    res.render('listings', { items: items, title: 'Listings' });
});



app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})