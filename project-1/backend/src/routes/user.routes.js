let express = require('express')
let userRouter =express.Router()
let authMiddleware = require('../middlewares/auth.middleware')
let {   followUserController,
    acceptFollowController,
    rejectFollowController,
    unfollowUserController} = require('../controllers/user.controller')


userRouter.post("/follow/:username", authMiddleware, followUserController)
userRouter.post("/accept/:username", authMiddleware, acceptFollowController)
userRouter.post("/reject/:username", authMiddleware, rejectFollowController)
userRouter.delete("/unfollow/:username", authMiddleware, unfollowUserController)


module.exports = userRouter