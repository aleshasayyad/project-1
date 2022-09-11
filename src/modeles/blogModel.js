const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim:true
    },
    body: {
        type: String,
        required: true,
        trim:true
    },
    authorId: {
        type: ObjectId,
        required: true,
        ref: "author"
    },
    tags: [],
    category: {
        type: String,
        required: true,
        trim:true
    },
    subcategory: [] ,
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: Date,
    },
},
    { timestamps: true });


module.exports = mongoose.model('blog', blogSchema)
