const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    title:{type:String, required:true},
    price:{type:Number, required:true},
    category:{type:String, required:true},
    seller:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}
},
{
    timestamps:true,
    versionKey:false
}
)

const ProductModel = mongoose.model("Product", productSchema);
module.exports = ProductModel;