const {validationResult} = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.postSignup=(req,res,next)=>{
    let email = req.body.email;
    let password = req.body.password;
    let name = req.body.name;
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        const err=new Error("the values you've entered are not allowed");
        err.httpStatusCode=400;
        err.data=errors;
        throw err;
    }
    bcrypt.hash(password,10)
        .then((hashedPassword)=>{
            const user = new User({
                name:name,
                password:hashedPassword,
                email:email,
                status:"hi i am new here",
                posts:[]
            });
            return user.save();
        })
        .then((createdUser)=>{
            res.status(201).json({
                message:"the user was created successfully",
                user:createdUser,
            })
        })
        .catch((err)=>{
            const error = new Error("can't add user in db");
            error.httpStatusCode=500;
            return next(error);
    })

};

exports.postLogin=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        const err=new Error("the values you've entered are not allowed");
        err.httpStatusCode=401;
        err.data=errors;
        throw err;
    }
    let loadedUser;
    User.findOne({email:email})
        .then((user)=>{
            loadedUser=user;
            if(!user){
                const err = new Error("email doesn't exist");
                err.httpStatusCode=400;
                throw err;
            }
            return bcrypt.compare(password,user.password)
        })
        .then((isEqual)=>{
            if(!isEqual){
                const err = new Error("wrong password");
                err.httpStatusCode=400;
                throw err;
            }
            const token = jwt.sign({userEmail:loadedUser.email,userId:loadedUser._id.toString()},process.env.TOKEN_SECRET,{expiresIn:"3h"});
            res.status(201).json({
                token:token,
                userId:loadedUser._id.toString(),
            })
        })
        .catch((err)=>{
            return next(err);
        })
}