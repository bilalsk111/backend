let express = require('express')
let authRouter = express.Router();
let userModel = require('../models/user.model')
let jwt = require('jsonwebtoken')
let crypto = require('crypto')

authRouter.post('/register', async (req,res)=>{
    let {name,email,password} = req.body

    let isUserExist = await userModel.findOne({email})

    if(isUserExist){
        return res.status(409).json({
            message: "user already exist"
        })
    }

    let user = await userModel.create({
        name,
        email,
        password:crypto.createHash('sha256').update(password).digest('hex')
    })
    let token = jwt.sign(
        {
            id: user._id,
        },process.env.JWT_TOKEN,{
            expiresIn: "1h"
        }
    )

    res.cookie('token', token)
    res.status(200).json({
        message: "user register successfully",
        user,
        token
    })

})

authRouter.get('/get-me',async (req,res)=>{
    let token = req.cookies.token

  let decode =  jwt.verify(token, process.env.JWT_TOKEN)

  let user = await userModel.findById(decode.id)
  res.json({
    name:user.name,
    email:user.email
  })
})

authRouter.post('/login', async (req,res)=>{
let {email,password} = req.body;
let user = await userModel.findOne({email})

if(!user){
    return res.status(404).json({
        message: "user not found"
    })
}

let hash = crypto.createHash('sha256').update(password).digest('hex');

let isPasswordVaild = hash === user.password

if(!isPasswordVaild){
    return res.status(401).json({
        message:"Invaild password"
    })
}

let token = jwt.sign(
    {
        id: user._id,
    },process.env.JWT_TOKEN,{expiresIn: "1h"}
)
 res.cookie('token',token)

 res.json({
    message:"user logged is succssefully",
    user: {
        name:user.name,
        email:user.email,
    }
 })
})





module.exports = authRouter