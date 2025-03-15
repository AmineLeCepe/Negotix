/*# Message:
- id (primary key)
- chatId (foreign key references chats)
- content
- creationDate
- isDeleted (bool, deletion feature only available to staff)
## Message:
- content cannot be longer than 500 characters*/

const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    chatId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Chat',
        required: true,
    },
    content:{
        type: String,
        required: true,
        maxlength: 500, 
    },
    creationDate:{
        type: Date,
        required: true,
        default: () => Date.now(),
        immutable: true,
    },
    isDeleted:{
        type: Boolean,
        default: false,
    }


})

// Check if model already exists in database, otherwise create it
const messageModel = mongoose.models.Message || mongoose.model("Message", messageSchema);

module.exports = messageModel;