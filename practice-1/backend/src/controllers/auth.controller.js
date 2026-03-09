let userModel =  require('../models/user.model')
const bcrypt = require("bcrypt");
let jwt = require('jsonwebtoken')

async function registerController(req,res){
    try{
        let {username,email,password,bio,profileImage} = req.body

        let existing = await userModel.findOne({
            $or:[
                {username},
                {email}
            ]
        })
        if(existing){
           return res.status(409).json({
            message:   existing.email === email
                ? "Email already exists"
                : "Username already exists",
           })
        }
        let hash = await bcrypt.hash(password,10)

        let user = await userModel.create({
            username,email,password:hash,bio,profileImage
        })
         if(!user){
            return res.status(401).json({
                message: 'user not created'
            })
         }

         let token = jwt.sign(
            {
                id:user._id,
            },process.env.JWT_TOKEN,{expiresIn:'1d'}
         )
         res.cookie('token',token,{httpOnly:true,secure:false})
         res.status(201).json({
            message:'user register successfully',
            user:{
                username:user.username,
                email:user.email,
                bio:user.bio,
                profileImage:user.profileImage
            }
         })
    }catch(error){
        console.log('Register error:', error);
        res.status(500).json({
            message: 'Registration failed',
            error: error.message
        })
    }
}

async function loginController(req,res) {
    try{
        let {username,email,password} = req.body

        let user = await userModel.findOne({
            $or:[
                {username:username},
                {email:email}
            ]
        })
        if(!user){
            return res.status(401).json({
                message:'user not found'
            })
        }
        let isPassword = await bcrypt.compare(password,user.password)
        if(!isPassword){
            return res.status(401).json({
                message:'password invalid'
            })
        }
        let token = jwt.sign(
            {
                id:user._id,
            },process.env.JWT_TOKEN,{expiresIn:'1d'}
        )
        res.cookie('token',token,{httpOnly:true,secure:false})
        res.status(201).json({
            message:'user login successfully',
            user:{
                username:user.username,
                email:user.email,
                bio:user.bio,
                profileImage:user.profileImage
            }
        })
    }catch(error){
        console.log('Login error:', error);
        res.status(500).json({
            message: 'Login failed',
            error: error.message
        })
    }
}

module.exports = {
    registerController,loginController
}