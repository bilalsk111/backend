let express = require('express')
let userRouter = express.Router()
let authMiddleware = require('../middlewares/auth.middleware')

let {
    followUser,
    acceptFollow,
    rejectFollow,
    unfollowUser,
    updateProfile,
    getProfile
} = require('../controllers/user.controller')

let multer = require('multer');
let storage = multer.memoryStorage();
let upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } })

userRouter.post("/follow/:username", authMiddleware, followUser)
userRouter.post("/accept/:username", authMiddleware, acceptFollow)
userRouter.post("/reject/:username", authMiddleware, rejectFollow)
userRouter.delete("/unfollow/:username", authMiddleware, unfollowUser)

userRouter.get("/profile/:username", getProfile)

userRouter.put(
    "/profile",
    authMiddleware,
    upload.single("profile"),   // field name must be "profile"
    updateProfile
);

module.exports = userRouter
