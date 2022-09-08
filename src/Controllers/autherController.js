const jwt = require("jsonwebtoken");
const validator = require('validator')
const AuthorModel = require("../modeles/authorModele.js")
const blogModel = require("../Controllers/blogController")

const createAuthor = async function (req, res) {
    try {
        let author = req.body
        let { fname, lname, email, password } = req.body
        if (validator.isEmail(email)) {
            let authorCreated = await AuthorModel.create(author)
            res.status(201).send({ status: true, data: authorCreated })
        } else {
            return res.status(400).send({ status: false, msg: " please Enter valid EmailId" })
        }

    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

const loginAuther = async function (req, res) {
    try {
        let { email, password } = req.body
        if (Object.keys(req.body).length != 0) {
            if (!validator.isEmail(email)) return res.status(400).send({ status: false, msg: " please Enter valid EmailId" })
            let Auther = await AuthorModel.findOne({ email: email, password: password });
            if (Auther) {
                let token = jwt.sign(
                    {
                        AutherId: Auther._id.toString(),
                        batch: "plutonium",
                        organisation: "FunctionUp",
                    },
                    "Project-1-blogging-groupe-50"
                );
                res.setHeader("x-api-key", token);
                res.status(201).send({ status: true, token: token });
            } else {
                return res.status(403).send({
                    status: false,
                    msg: "Email or password is not corerct",
                });
            }
        } else {
            return res.status(400).send({ msg: "Send the data Body" })
        }
    } catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }
}


module.exports.createAuthor = createAuthor
module.exports.loginAuther = loginAuther
