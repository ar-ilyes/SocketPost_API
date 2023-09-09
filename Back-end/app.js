const express = require('express');
const path=require("path");
const bodyParser = require("body-parser");
const { default: mongoose } = require('mongoose');
require("dotenv").config();

const feedRouter=require("./routes/feed");

const app = express();

app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers","Content-Type , Authorization");
    next();
})

app.use("/images",express.static(path.join(__dirname,"images")))

app.use(feedRouter);

app.use((err,req,res,next)=>{
    res.status(err.httpStatusCode).json({
        message:err.message,
    })
})

mongoose.connect(process.env.MONGO_URI).then(()=>{
    app.listen(8080,()=>{
        console.log("start listening ");
    })
}).catch((err)=>{
    console.log(err);
})
