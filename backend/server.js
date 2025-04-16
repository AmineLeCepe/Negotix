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
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})