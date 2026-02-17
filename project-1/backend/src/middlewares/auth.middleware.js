let jwt = require('jsonwebtoken')


async function authmiddleware(req,res,next) {
    let token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message:"token not provided, Unauthorized access"
        })
    }
    let decode = null
    try{
        decode = jwt.verify(token,process.env.JWT_TOKEN)
    }catch(err){
         return res.status(401).json({
            message: "user not authorized"
        })
    }
    req.user = decode
    next();
}

module.exports = authmiddleware