/*Category:
- id (primary key)
- name*/

const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    name:{
        required: true,
        type: String,
        minlength: 3,
        maxlength: 16,
    },
   
})

// Check if model already exists in database, otherwise create it
const categoryModel = mongoose.models.Category || mongoose.model("Category", categorySchema);

module.exports = categoryModel;