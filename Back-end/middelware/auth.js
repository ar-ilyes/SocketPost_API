const jwt =require("jsonwebtoken");
require("dotenv").config();

const auth=(req,res,next)=>{
    const AuthorizationToken =req.get("Authorization");
    if(!AuthorizationToken){
        const err = new Error("not authenticated");
        err.httpStatusCode=401;
        throw err;
    }
    let token = AuthorizationToken.split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token,process.env.TOKEN_SECRET);
    }
    catch(err){
        err.httpStatusCode=500;
        throw err;
    }
    if(!decodedToken){
        const err = new Error("not authenticated");
        err.httpStatusCode=401;
        throw err;
    }
    req.userId = decodedToken.userId;
    next();
}

module.exports = auth;