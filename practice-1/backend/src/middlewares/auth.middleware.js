let jwt = require('jsonwebtoken')


async function authmiddleware(req,res,next){
    let token = req.cookies?.token

    if(!token){
        return res.status(401).json({
            message:"Authentication required. Please log in."
        })
    }
    let decode = jwt.verify(token,process.env.JWT_TOKEN)
    if(!decode || !decode.id){
          return res.status(401).json({
                message: "Invalid token payload"
            });
    }
    req.user = decode;
        next();
}
module.exports = authmiddleware