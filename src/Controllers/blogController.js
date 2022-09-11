const blogModel = require("../modeles/blogModel")
const autherModel = require("../modeles/authorModele")
const mongoose =require("mongoose")

// ======================================>> create Blogs <<========================================//

const createBlogs = async function (req, res) {
    try {
        const blog = req.body
        let { title, body, authorId, tags, category, subcategory } = blog

        if (!title) return res.status(400).send({ status: false, data: " please enter title" })
        if (!body) return res.status(400).send({ starus: false, data: "please enter body" })
        if (!authorId) return res.status(400).send({ status: false, data: "please enter authorId" })
        if (!category) return res.status(400).send({ status: false, data: "please enter category" })
        if (!mongoose.Types.ObjectId.isValid(authorId)) {
            return res.status(400).send({ status: false, msg: "please enter valid author id " })
        }

        let checkAuther = await autherModel.findById(authorId)
        if (checkAuther) {
            let createdBlogs = await blogModel.create(blog)
            res.status(201).send({ status: true, data: createdBlogs })
        } else {
            res.status(401).send({ status: true, msg: " Auther is not valid" })
        }
    } catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

// ====================================>> Get Blogs <<===============================================//

const getBologs = async function (req, res) {
    try {
        let data = req.query
        if (!Object.keys(data).length != 0) return res.status(400).send({ status: false, msg: "Please Give Any Filter" })
        let { authorId, category, tags, subcategory } = req.query
        let getBolog = await blogModel.find(
            {
                $or: [{ authorId: authorId },
                { category: category },
                { tags: { $in: [tags] } },
                { subcategory: { $in: [subcategory] } }],
                isDeleted: false, isPublished: true,
            })
        if (getBolog.length != 0) {
            res.status(200).send({ status: true, data: getBolog })
        } else {
            res.status(404).send({ status: false, msg: "Blogs Not Found" })
        }
    } catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

// ======================================>> Update Blog <<========================================//


const updateBlogs = async function (req, res) {
    try {
        let = req.body
        if (!Object.keys(data).length != 0) return res.status(400).send({ status: false, msg: "Please Give Any Data in Body" })
        let blogId = req.params.blogId
        let { title, body, tags, subcategory, isPublished } = data

        if (blogId) {
            let check1 = await blogModel.findOne({ _id: blogId, isDeleted: false })
            if (check1) {
                let updateBlogs = await blogModel.findByIdAndUpdate(
                    blogId,
                    {
                        $set: { body: body, title: title, isPublished: isPublished, publishedAt: new Date },
                        $push: { tags: tags, subcategory: subcategory }
                    }, { new: true })
                return res.status(200).send({ status: true, data: updateBlogs })
            } else {
                return res.status(404).send({ status: false, msg: "Data Not found" })
            }
        } else {
            return res.status(400).send({ status: false, msg: "Give Blog Id in Path params" })
        }
    } catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }

}

// ======================================>> Delete Blog <<========================================//


const deleteblog = async function (req, res) {
    try {
        let blogId = req.blogId
        if (blogId) {
            let check1 = await blogModel.find({ _id: blogId, isDeleted: false })
            if (check1.lenght != 0) {
                let deletedblog = await blogModel.updateMany({ check1 }, { $set: { isDeleted: true, deletedAt: new Date } })
                res.status(200).send()
            } else {
                return res.status(404).send({ status: false, msg: "Blog Already Deleted" })
            }
        } else {
            return res.status(400).send({ status: false, msg: "please give BlogId in path params" })
        }
    } catch (error) {
        return res.status(500).send({ msg: "Error", error: error.message })
    }
}

// ======================================>> Delete blog using Filter <<=============================//


const deleteBloggByQuery = async function (req, res) {
    try {
        let AutherId = req.AutherId
        let deleteblog = await blogModel.updateMany(AutherId, { $set: { isDeleted: true, deletedAt: new Date } })
        res.status(200).send()
    } catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

module.exports = { createBlogs, getBologs, updateBlogs, deleteblog, deleteBloggByQuery } 