const express = require("express");
const connection = require("./config/db");
const cors = require('cors');
const userRouter = require("./routes/user.route");
const productRouter = require("./routes/product.route");

const PORT = process.env.PORT ||8080

const app = express();
app.use(cors())
app.use(express.json())
app.use("/user", userRouter),
app.use("/products", productRouter)



app.listen(PORT, async() =>{
    try{
        await connection;
        console.log(`Server is running on port:${PORT} && DB connected successfully!`)
    }catch(err){
        console.log(`Err occured while connteing DB ${err}`)
    }
})