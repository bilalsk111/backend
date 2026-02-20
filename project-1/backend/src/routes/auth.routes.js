const express = require("express")
const router = express.Router()
const { registerController, loginController, GetMe } = require("../controllers/auth.controller")

router.post("/register", registerController)
router.post("/login", loginController)
router.get("/get-me", authmiddleware, GetMe)

module.exports = router