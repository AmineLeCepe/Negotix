require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (e) {
        console.error("Error connecting to MongoDB Atlas: ", e);
    }
}

module.exports = connectDB;