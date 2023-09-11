const express = require('express');
const {body} = require('express-validator');
const User = require('../models/user')
const authController =require("../controllers/authController");

const router = express.Router();

router.post('/signup',[
    body('email').trim().isEmail().custom((value,{req})=>{
        return User.findOne({email:value}).then((user)=>{
            console.log(user);
            if(user){
                return Promise.reject("this email is already used");
            }
            return Promise.resolve();
        })
    }),
    body('password').trim().isLength({min:5}),
    body('name').trim().isLength({min:5}),
],authController.postSignup);

router.post('/login',[
    body('email').trim().isEmail(),
    body('password').trim().isLength({min:5}),
],authController.postLogin);

module.exports = router;