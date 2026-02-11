const express = require('express');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken')
const authRouter = express.Router();
const crypto = require('crypto')



authRouter.post('/register',async (req,res)=>{
    const {email,password,name} = req.body;

    const isAuthemail = await userModel.findOne({email});

    if(isAuthemail){
        return res.status(409).json({
            message: "User already exists with this email address"
        })
    }
    const hash = crypto.createHash('md5').update(password).digest('hex')
    const user = await userModel.create({
        email, password:hash ,name
    })

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_TOKEN
    )
    res.cookie('token',token)

    res.status(201).json({
        message: "user created",
        user,
        token
    })

})

// authRouter.post('/protected',(req,res)=>{
//     console.log(req.cookies);
    
//     res.status(200).json({
//         message: "this is a protected route"
//     })
// })

authRouter.post('/login',async (req,res)=>{
    const {email,password} = req.body
    
    const user = await userModel.findOne({email})
    if(!user){
        return res.status(404).json({
            message: "email not found"
        })
    }    

    const isPasswordmatch = user.password === crypto.createHash('md5').update(password).digest('hex');

    if(!isPasswordmatch){
        return res.status(401).json({
            message: "Invaild password"
        })
    }
    const token = jwt.sign(
        {
            id: user._id,
        },
        process.env.JWT_TOKEN
    )
    res.cookie('token', token)

    res.status(200).json({
        message: "user logged in successfully",
        user,
        token
    })
})

module.exports = authRouter