let express = require('express')
let userRouter =express.Router()
let authMiddleware = require('../middlewares/auth.middleware')
let {followUser,acceptFollow,rejectFollow,unfollowUser} = require('../controllers/user.controller')


userRouter.post("/follow/:username", authMiddleware, followUser)
userRouter.post("/accept/:username", authMiddleware, acceptFollow)
userRouter.post("/reject/:username", authMiddleware, rejectFollow)
userRouter.delete("/unfollow/:username", authMiddleware, unfollowUser)


module.exports = userRouter