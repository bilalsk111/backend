import express from 'express'
import { register } from '../controllers/auth.controller.js'
const authRouter = express.Router()
import { registerValidation } from "../validations/auth.validator.js";


authRouter.post('/register',registerValidation,register)




export default authRouter