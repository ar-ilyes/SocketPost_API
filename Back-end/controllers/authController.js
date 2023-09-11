const {validationResult} = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");

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
            console.log(err);
            const error = new Error("can't store post in db");
            error.httpStatusCode=500;
            return next(error);
    })

};