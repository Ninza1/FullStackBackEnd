const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const auth = async (req, res, next) =>{
    const token =  req.headers.authorization.split(" ")[1];
  

    if(!token){
        return res.status(403).json({msg:"Access denied. NO token provided"})
    }

    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = await UserModel.findById(decoded._id)
        next();
    }catch(err){
        res.send(`Invalid token ${err}`)
    }
}

module.exports = auth;
