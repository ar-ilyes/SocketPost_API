const express = require("express");
const {body}=require('express-validator')

const router = express.Router();
const feedController = require("../controllers/feedController");

router.get("/posts",feedController.getPosts);

router.post("/posts",[body("title").isLength({min:5}),body("content").isLength({min:5})],feedController.createPost);

router.get('/posts/:postId',feedController.getPost);

module.exports=router;