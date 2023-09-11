const Post = require("../models/post");
const {validationResult} = require("express-validator")
exports.getPosts=(req,res,next)=>{
    Post.find()
        .then((posts)=>{
            res.status(200).json({
                message:"posts fetched successfully",
                posts:posts,
                totalItems:2,//to be changed
            })
        })
        .catch((err)=>{
            const error = new Error("can't fetch the posts from db");
            error.httpStatusCode=500;
            return next(error);
        })
}
exports.createPost=(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const err=new Error("the values you've entered are not allowed");
        err.httpStatusCode=400;
        throw err;
    }
    const title = req.body.title;
    const content = req.body.content;
    const creator = {
        name:"ilyes",
    };
    const image = req.file;
    if(!image){
        const err=new Error("you need to enter a valid image");
        err.httpStatusCode=400;
        throw err;
    }
    const imageUrl = image.path.replace(/\\/g, '/');///!!!!! the replace here must be used if we are using windows in our server 
    const post = new Post({
        title:title,
        content:content,
        creator:creator,
        imageUrl:imageUrl,
    });
    post.save()
        .then((post)=>{
            res.status(201).json({
                message:"post created successfully",
                post:post,
            })
        })
        .catch((err)=>{
            console.log(err);
            const error = new Error("can't store post in db");
            error.httpStatusCode=500;
            return next(error);
        })
}

exports.getPost=(req,res,next)=>{
    const postId = req.params.postId;
    Post.findById(postId)
        .then((post)=>{
            res.status(200).json({
                message:"post fetched successfully",
                post:post,
            })
        })
        .catch((err)=>{
            console.log(err);
            const error = new Error("can't fetch single post from db");
            error.httpStatusCode=500;
            return next(error);
        })
}