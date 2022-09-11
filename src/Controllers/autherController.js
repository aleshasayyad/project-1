const jwt = require("jsonwebtoken");
const validator = require('validator')
const AuthorModel = require("../modeles/authorModele.js")

// ======================================== Create Auther ===================================

const createAuthor = async function (req, res) {
    try {
        let author = req.body

        let { fname, lname, email, password, title } = author

        if (!(fname && lname && email && password && title)) {
            return res.status(400).send({ status: false, msg: "Provide All data in Body" })
        }

        if (title !== "Mr" && title !== "Mrs" && title !== "Miss") {
            return res.status(400).send({ status: false, data: "Please Send The Valid title like:- Mr, Mrs, Miss" })
        }
        const validName = function (value) {
            return (/^(?![\. ])[a-zA-Z\. ]+(?<! )$/.test(value))
        }

        if (!validName(fname)) return res.status(400).send({ status: false, data: "fname Should be String" })
        if (!validName(lname)) return res.status(400).send({ status: false, data: "lname Should be String" })

        let validPassword = function (pass) {
            return (/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&])[a-zA-Z0-9@#$%&]{6,20}$/.test(pass))
        }
        if (!validPassword(password)){
            
            return res.status(400).send({ status: false, data: " Password should be min 6 and max 20 character.It contains atleast--> 1 Uppercase letter, 1 Lowercase letter, 1 Number, 1 Special character"})
        
            
        }

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

// ================================= Login Auther =====================================

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
            return res.status(400).send({ msg: "Please Enter Email And password" })
        }
    } catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

module.exports = {createAuthor, loginAuther} 