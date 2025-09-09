const express=require("express")
const dotEnv = require("dotenv")
const mongoose = require("mongoose")
const bodyParser = require('body-parser');
const vendorRoutes = require('./routes/vendorRoutes');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const path = require('path')


const app=express()

const PORT = 3000;

dotEnv.config()

app.use(bodyParser.json()); 

// Vendor routes with middleware
app.use('/vendor', vendorRoutes); 

app.use('/firm',firmRoutes)

// Use product routes with middleware
app.use('/product', productRoutes);

app.use('/uploads',express.static('uploads'));



mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB connected succesfully"))
.catch((error)=> console.log(error))

app.listen(PORT, ()=>{
    console.log('server started and running')
});

app.use("/home",(req,res)=>{
    res.send("<h1>This is home page")
})