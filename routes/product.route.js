const express = require("express");
const auth = require("../middlewares/auth");
const checkAccess = require("../middlewares/checkAccess");
const roles = require("../constants/roles");
const ProductModel = require("../models/product.model");
const productRouter = express.Router();



productRouter.get("/", async (req, res) => {
    try {
        const data = await ProductModel.find().populate("seller", "name") // will populat only Auther name
        res.json({ msg: "Porduct data fetched successfully,", data })
    } catch (err) {
        res.send(`Err while fething product data: ${err}`)
    }
})

productRouter.post("/create", auth, checkAccess(roles.seller), async (req, res) => {
    const productData = req.body;
    try {
        const newProduct = new ProductModel({ ...productData, seller: req.user._id })
        const saveProduct = await newProduct.save();
        res.json(saveProduct);

    } catch (err) {
        res.send(`Err occured while creating product: ${err}`)
    }
})


productRouter.patch("/update/:id", auth, checkAccess(roles.seller), async (req, res) => {
    const { id } = req.params;
    try {
        const productId = req.params.id;
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }

        // verify when user is trying to update someone's blog
        if (product.seller.toString() !== req.user._id.toString()) {
            res.status(403).json({ msg: "Access denied!" })
        }
        const updateProduct = await ProductModel.findByIdAndUpdate({_id:productId}, req.body)
        res.status(200).json({ msg: "product updated successfully!", updateProduct })

    } catch (err) {
        res.send(`Err occured while updating product: ${err}`)
    }
})


productRouter.delete("/delete/:id", auth, checkAccess(roles.seller), async (req, res) => {
    const { id } = req.params;
    try {
        const productId = req.params.id;
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: "product not found" });
        }

        // verify when user is trying to update someone's blog
        if (product.seller.toString() !== req.user._id.toString() && req.user.role !== roles.admin) {
            res.status(403).json({ msg: "Access denied!" })
        }
        const deleteProduct = await ProductModel.findByIdAndDelete(productId)

        res.status(201).json({ msg: "product deleted successfully!", deleteProduct })
    } catch (err) {
        res.send(`Err occured while deleting product: ${err}`)
    }
})

module.exports = productRouter;