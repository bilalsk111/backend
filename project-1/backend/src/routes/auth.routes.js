const express = require("express")
const router = express.Router()
const { registerController, loginController, GetMe,logout } = require("../controllers/auth.controller")
const authmiddleware = require("../middlewares/auth.middleware")

router.post("/register", registerController)
router.post("/login", loginController)
router.get("/getme", authmiddleware, GetMe)
router.post("/logout", authmiddleware,logout)



module.exports = router