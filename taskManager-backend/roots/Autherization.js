const express=require("express");
const User=require("../models/User");
const router=express.Router();

const jwt=require("jsonwebtoken");
const { Model } = require("mongoose");

router.post("/login", async(req,res)=>{
    const{email,password}=req.body;

    const user=await User.findOne({email});
    if(!user) return res.status(400).json({message:"USER NOT FOUND"});

    const valid=await user.checkPassword(password);
     if(!valid)return res.status(400).json({message:"WRONG PASSWORD"});

     //GENERATE JWT
     const token=jwt.sign({
        id:user._id,email:user.email},
        process.env.JWT_SECRET
    );
        res.json({token});
});


router.post("/register", async(req,res)=>{
    const{email,password}=req.body;
    const user=new User({email,password});
    await user.save();
    res.json({message:" USER REGISTERED"})
});

module.exports = router;