const express = require("express");
const {body}=require('express-validator');
const isAuth = require("../middelware/auth");

const router = express.Router();
const feedController = require("../controllers/feedController");

router.get("/posts",isAuth,feedController.getPosts);

router.post("/posts",isAuth,[body("title").isLength({min:5}),body("content").isLength({min:5})],feedController.createPost);

router.get('/posts/:postId',isAuth,feedController.getPost);

router.delete("/posts/:postId",isAuth,feedController.deletePosts);

module.exports=router;