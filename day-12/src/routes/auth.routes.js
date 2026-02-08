const express = require('express');
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const authRouter = express.Router();



authRouter.post('/register', async (req,res)=>{
    const {email,password,name} = req.body;

    const isAutheEmailCheck = await userModel.findOne({email});
    if(isAutheEmailCheck){
        return res.status(409).json({
              message: "User already exists with this email address"
        })
    }

    const user = await userModel.create({
        email,password,name
    })

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_TOKEN
    )
    res.cookie('token', token)

    res.status(201).json({
        message: "user Create",
        user,
        token
    })

})



module.exports = authRouter
