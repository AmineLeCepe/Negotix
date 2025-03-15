const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/mongodb');

// App config
const app = express();
const port = process.env.PORT || 3000;
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

// API endpoints
app.get('/', (req, res) => {
    res.send('API working');
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})