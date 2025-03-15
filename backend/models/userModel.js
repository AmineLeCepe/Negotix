const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        unique: true,
        required: true,
        type: String,
        minLength: 3,
        maxLength: 16,
    },
    email: {
        unique: true,
        type: String,
        required: true,
        lowercase: true,
        minlength:5,
        maxlength:80,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    createdAt: {
        required: true,
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
const userModel = mongoose.models.user || mongoose.model("User", userSchema);

module.exports = userModel;
