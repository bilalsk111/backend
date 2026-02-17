let userModel = require('../models/user.model')
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')

async function registerController(req, res) {
    let { username, email, password, bio, profileImage } = req.body

    let isUserAlreadyExists = await userModel.findOne({
        $or: [
            {
                username
            },
            {
                email
            }
        ]
    })

    if (isUserAlreadyExists) {
         return res.status(409).json({
        message:
            "user already exist " +
            (isUserAlreadyExists.email === email
                ? "email already exist"
                : "username already exists"),
    });
    }

    let hash = await bcrypt.hash(password, 10)

    let user = await userModel.create({
        username, email, password: hash, bio, profileImage
    })

    let token = jwt.sign(
        {
            id: user._id,
        }, process.env.JWT_TOKEN,{ expiresIn: "1d" }
    )
    res.cookie('token', token)
    res.status(201).json({
        message: "user register successfully",
        user: {
            username: user.username,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })
}

async function loginController(req,res){
    let {username,email,password} = req.body

    let user = await userModel.findOne({
        $or: [
            {username:username},
            {email:email}
        ]
    })
    if(!user){
        return res.status(401).json({
            message:"user not found"
        })
    }

    let isPasswordVaild = await bcrypt.compare(password,user.password)

    if(!isPasswordVaild){
        return res.status(401).json({
            message: "password invaild"
        })
    }
    let token = jwt.sign(
        {
            id: user._id
        },process.env.JWT_TOKEN,{expiresIn: "1d"}
    )
        res.cookie('token',token)

  res.status(200).json({
        message: "user login successfully",
       user: {
         email: user.email,
        username: user.username,
        bio: user.bio,
        profileImage: user.profileImage
       }
    })
}

module.exports = {
    registerController,loginController
}