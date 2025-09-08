const jwt=require("jsonwebtoken");

function auth(req,res,next){
    const token =req.header["authorization"]?.split(" ")[1];
    if(!token)return res.status(401).json({message: "No Token"});

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;//attach user info
        next();

    }catch(err){
        res.status(401).json({message: "INVALID TOKEN"});
    }
}

module.exports = auth;
