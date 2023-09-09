const express = require('express');
const path=require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
const { default: mongoose } = require('mongoose');
require("dotenv").config();

const feedRouter=require("./routes/feed");

const app = express();

app.use(bodyParser.json());

const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images')
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString().replace(/:/g, '-')+'-'+file.originalname);
    }
});

const fileFilter = (req,file,cb)=>{
    if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" ){
        cb(null,true);
    }else{
        cb(null,false);
    }
}

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers","Content-Type , Authorization");
    next();
})

app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single("image"));

app.use("/images",express.static(path.join(__dirname,"images")))



app.use(feedRouter);

app.use((err,req,res,next)=>{
    const status = err.httpStatusCode || 500;
    res.status(status).json({
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
