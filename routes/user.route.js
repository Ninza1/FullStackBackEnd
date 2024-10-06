
const express = require("express");
const UserModel = require("../models/user.model");
const userRouter = express.Router();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const checkAccess = require("../middlewares/checkAccess");
const roles = require("../constants/roles");
const auth = require("../middlewares/auth");


// get all user only admin can access
userRouter.get("/", auth, checkAccess(roles.admin), async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(201).send(users)

    } catch (err) {
        res.status(500).send(err)
    }
})


userRouter.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        let newUser = await UserModel.findOne({ email });
        if (newUser) {
            return res.status(401).send("User already exist")
        }

        const hashPassword = await bcrypt.hash(password, 10)
        newUser = new UserModel({ name, email,  password: hashPassword, role });
        const saveUser = await newUser.save();
        res.status(201).json({ msg: "Registered successfully!", saveUser })

    } catch (err) {
        res.send(`Err occured while creating user: ${err}`)
    }
})

userRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User not found" })
        }
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(402).json({ msg: "Password is wrong" })
        }

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.SECRET_KEY);
        res.json({ token, message: "Logged in successfully", userId:user._id })


    } catch (err) {
        res.send(`Err occured while login: ${err}`)
    }
})



module.exports = userRouter;