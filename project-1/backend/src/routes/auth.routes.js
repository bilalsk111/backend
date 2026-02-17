let express = require('express')
let authRouter = express.Router();
let {registerController,loginController} = require('../controllers/auth.controller')
 

authRouter.post('/register',registerController)
authRouter.post('/login',loginController)



module.exports = authRouter