const blogModel = require("../modeles/blogModel")
const autherModel = require("../modeles/authorModele")
var mongoose = require('mongoose');


const createBlogs = async function (req, res) {
    try {
        let blogs = req.body
        let authId = req.body.authorId
        let checkAuther = await autherModel.findById(authId)
        if (checkAuther) {
            let createdBlogs = await blogModel.create(blogs)
            res.status(201).send({ status: true, data: createdBlogs })
        } else {
            res.status(401).send({ status: true, msg: " Auther is not valid" })
        }
    } catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

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
                { subcategory: { $in: [subcategory] } }], isDeleted: false, isPublished: true,
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
const updateBlogs = async function (req, res) {
    try {
        let data = req.body
        if (!Object.keys(data).length != 0) return res.status(400).send({ status: false, msg: "Please Give Any Data in Body" })
        let blogId = req.params.blogId
        let { title, body, tags, subcategory, isPublished } = req.body
        if (blogId) {
            let check1 = await blogModel.findOne({ _id: blogId, isDeleted: false })
            if (check1) {
                let updateBlogs = await blogModel.findByIdAndUpdate(
                    blogId,
                    {
                        $set: { body: body, title: title, isPublished: isPublished, },
                        $push: { tags: tags, subcategory: subcategory }
                    })
                return res.status(200).send({ status: true, data: updateBlogs })
            } else {
                return res.status(404).send({ status: false, msg: "Data Not found" })
            }
        } else {
          return  res.status(400).send({ status: false, msg: "Give Blog Id in Path params" })
        }
    } catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }

}

const deleteblog = async function (req, res) {
    try {
        let blogId = req.blogId
        if (blogId) {
            let check1 = await blogModel.find({ _id: blogId, isDeleted: false })
            if (check1.lenght != 0) {
                let deletedblog = await blogModel.updateMany({ check1 }, { $set: { isDeleted: true, deletedAt: new Date } })
                res.status(200).send()
            } else {
              return  res.status(404).send({ status: false, msg: "Blog Not found" })
            }
        } else {
          return  res.status(400).send({ status: false, msg: "please give BlogId in path params" })
        }
    } catch (error) {
      return  res.status(500).send({ msg: "Error", error: error.message })
    }
}

const deleteBloggByQuery = async function (req, res) {
    try {
        let AutherId = req.AutherId
        let deleteblog = await blogModel.updateMany(AutherId, { $set: { isDeleted: true, deletedAt: new Date } })
        res.status(200).send()
    } catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }


}
module.exports.createBlogs = createBlogs
module.exports.getBologs = getBologs
module.exports.updateBlogs = updateBlogs
module.exports.deleteblog = deleteblog
module.exports.deleteBloggByQuery = deleteBloggByQuery