const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const blogModel = require("../modeles/blogModel");

// ============================================>> Authentication use for identifying user to access a system<<===================================================


const tokenverify = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (token) {
            let decodedToken = jwt.verify(token, "Project-1-blogging-groupe-50")
            let auther = decodedToken.AutherId
            req.AutherId = auther
            next();
        } else {
            return res.status(400).send({ status: false, msg: "token must be present" });
        }
    } catch (error) {
        res.status(500).send({ status: false, error: error.message });
    }

};

// ============================================>> Authorisation  giving permission to access the resources<<===================================================

const auth = async function (req, res, next) {
    try {
        let tokenAutherId = req.AutherId
        let blogid = req.params.blogId

        let checkValidBolgId = mongoose.Types.ObjectId.isValid(blogid)
        if (!checkValidBolgId) return res.status(400).send({ status: false, msg: "ObjectId Not valid" })

        let findauther = await blogModel.findById(blogid).select({ authorId: 1, _id: 0 })

        if (Object.keys(findauther).length == 0) return res.status(404).send({ status: false, msg: "Blog not found" })
        let Auther = findauther.authorId

        if (tokenAutherId == Auther) {
            req.blogId = blogid
            next();
        } else {
            return res.status(403).send({ status: false, msg: "Sorry You are not authorised" })
        }
    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
}

// ============================================>> Authorisation <<============================================

const auth2 = async function (req, res, next) {
    try {
        let tokenAutherId = req.AutherId
        let data = req.query
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Please Give Any Filter" })
        let { AutherId, category, tags, subcategory, unpublished } = req.query

        let findauther2 = await blogModel.find(
            {
                $or: [{ authorId: AutherId },
                { category: category },
                { tags: { $in: [tags] } },
                { subcategory: { $in: [subcategory] } }, { isPublished: unpublished }]
                , isDeleted: false
            }).select({ authorId: 1, _id: 0 })

        if (findauther2.length == 0) return res.status(404).send({ status: false, msg: "Blog Already Deleted" })

        for (let i = 0; i < findauther2.length; i++) {
            const auther = findauther2[i];

            if (tokenAutherId == auther.authorId) {
                req.AutherId = auther
                next()
            } else {
                return res.status(403).send({ status: false, msg: "Sorry You are not authorised" })
            }
        }
    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }

}
module.exports.tokenverify = tokenverify
module.exports.auth = auth
module.exports.auth2 = auth2