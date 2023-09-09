const express = require("express");

const router = express.Router();
const feedController = require("../controllers/feedController");

router.get("/posts",feedController.getPosts);

router.post("/posts",feedController.createPost);

router.get('/posts/:postId',feedController.getPost);

module.exports=router;