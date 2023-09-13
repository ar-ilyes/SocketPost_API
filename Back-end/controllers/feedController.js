const Post = require("../models/post");
const {validationResult} = require("express-validator");
const fs = require("fs");
const path = require("path");
const User =require('../models/user');

exports.getPosts=(req,res,next)=>{
    Post.find().populate("creator").exec()
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
    const creator = req.userId;
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
    let storedPost;
    post.save()
        .then((post)=>{
            storedPost=post;
            return User.findById(req.userId);
            
        }).then((user)=>{
            if(!user){
                throw new Error("no user found!!!");
            }
            user.posts.push(storedPost._id);
            return user.save();
        })
        .then((user)=>{
            res.status(201).json({
                message:"post created successfully",
                post:storedPost,
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
    Post.findById(postId).populate("creator").exec()
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

exports.editPost =(req,res,next)=>{
    let postId = req.params.postId;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const err=new Error("the values you've entered are not allowed");
        err.httpStatusCode=400;
        throw err;
    }
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.image;
    if(req.file){
        imageUrl=req.file.path.replace(/\\/g, '/');
    }
    if(!imageUrl){
        const err=new Error("you need to enter a valid image");
        err.httpStatusCode=400;
        throw err;
    }
    Post.findById(postId)
        .then((post)=>{
            if(post.creator.toString()!==req.userId.toString()){
                let err = new Error("not Authorized");
                err.httpStatusCode=401;
                throw err;
            }
            if(post.imageUrl!==imageUrl){
                clearPicture(post.imageUrl);
            }
            post.title=title;
            post.content=content;
            post.imageUrl=imageUrl;
            return post.save();
        })
        .then((post)=>{
            res.status(200).json({
                message:"post edited successfully",
                post : post,
            })
        })
        .catch((err)=>{
            console.log(err);
            return next(err);
        })
}

exports.deletePosts = (req,res,next)=>{
    let postId = req.params.postId;
    //chercher le post extraire le chemin de la photo et l'effacer
    //effacer le post
    //effacer le post de user.posts
    let deletedPost;
    Post.findById(postId)
        .then((post)=>{
            if(post.creator.toString()!==req.userId.toString()){
                let err = new Error("not Authorized");
                err.httpStatusCode=401;
                throw err;
            }
            if(!post){
                throw new Error("can't find this post");
            }
            clearPicture(post.imageUrl);
            return Post.deleteOne({_id:postId});
        })
        .then((post)=>{
            deletedPost=post;
            return User.findById(req.userId);
        })
        .then((user)=>{
            let userPosts = user.posts.filter((val,ind)=>{
                return val.toString() !== postId.toString();
            })
            user.posts=userPosts;
            return user.save();
        })
        .then((user)=>{
            res.status(200).json({
                message: "the post was deleted successfully",
                post:deletedPost,
            })
        })
        .catch((err)=>{
            console.log(err);
            return next(err);
        })
}

const clearPicture=(imageUrl)=>{
    let imagePath=path.join(__dirname,'..',imageUrl);
    fs.unlink(imagePath,(error)=>{
        if(error){
            console.log(error);
            error.httpStatusCode=500;
            throw error;
        }
    })
}