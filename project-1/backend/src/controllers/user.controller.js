const followModel = require("../models/follow.model")
const userModel = require("../models/user.model")


// SEND FOLLOW REQUEST
async function followUserController(req, res) {

    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    if (followerUsername === followeeUsername) {
        return res.status(400).json({
            message: "You cannot follow yourself"
        })
    }

    const followeeUser = await userModel.findOne({ username: followeeUsername })

    if (!followeeUser) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    const existingRequest = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })

    if (existingRequest) {
        return res.status(200).json({
            message: "Follow request already sent",
            follow: existingRequest
        })
    }

    const followRecord = await followModel.create({
        follower: followerUsername,
        followee: followeeUsername,
        status: "pending"
    })

    res.status(201).json({
        message: "Follow request sent",
        follow: followRecord
    })
}



// ACCEPT FOLLOW REQUEST
async function acceptFollowController(req, res) {

    const receiverUsername = req.user.username
    const senderUsername = req.params.username

    const updatedFollow = await followModel.findOneAndUpdate(
        {
            follower: senderUsername,
            followee: receiverUsername,
            status: "pending"
        },
        { status: "accepted" },
        { new: true }
    )

    if (!updatedFollow) {
        return res.status(404).json({
            message: "Follow request not found"
        })
    }

    res.status(200).json({
        message: "Follow request accepted",
        follow: updatedFollow
    })
}

// REJECT FOLLOW REQUEST
async function rejectFollowController(req, res) {

    const receiverUsername = req.user.username
    const senderUsername = req.params.username

    const deleted = await followModel.findOneAndDelete({
        follower: senderUsername,
        followee: receiverUsername
    })

    if (!deleted) {
        return res.status(404).json({
            message: "Follow request not found"
        })
    }

    res.status(200).json({
        message: "Follow request rejected"
    })
}
// UNFOLLOW USER
async function unfollowUserController(req, res) {

    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    const existingFollow = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })

    if (!existingFollow) {
        return res.status(200).json({
            message: `You are not following ${followeeUsername}`
        })
    }

    await followModel.findByIdAndDelete(existingFollow._id)

    res.status(200).json({
        message: `You have unfollowed ${followeeUsername}`
    })
}
module.exports = {
    followUserController,
    acceptFollowController,
    rejectFollowController,
    unfollowUserController
}
