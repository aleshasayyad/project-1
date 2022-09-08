const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({

    fname: {
        type: String,
        required: true,
        trim: true,
        minlength:[2, "minimum 2letters"],
        maxlength:30
    },
    lname: {
        type: String,
        required: true,
        trim: true,
        minlength:[2, "minimum 2letters"],
        maxlength:30
    },
    title: {
        type: String,
        enum: ["Mr", "Mrs", "Miss"],
        required: true
    },
    email: {
        type: String,
        required:true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength:6,
        maxlength:15,
        trim:true
    },

}, { timestamps: true })
module.exports = mongoose.model('author', authorSchema)