const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 5,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 80,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    }
});

// Check if model already exists in database, otherwise create it
const userModel = mongoose.models.user || mongoose.model("user", userSchema);

module.exports = userModel;