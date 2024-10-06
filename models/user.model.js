const mongoose = require("mongoose")
const roles = require("../constants/roles")

const userSchema = new mongoose.Schema({
    name:{type:String, required:true, unique:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    role:{type:String, enum:[roles.admin, roles.seller, roles.buyer], default:roles.buyer},
},
{
    versionKey:false
})


const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
