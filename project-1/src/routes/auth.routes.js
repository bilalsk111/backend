let express = require('express');
let authController = require('../controllers/auth.controller')
let authRouter = express.Router();


authRouter.post('/register',authController.registerController)

authRouter.post('/login',authController.loginController)



module.exports = authRouter