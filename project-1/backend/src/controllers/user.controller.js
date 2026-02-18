const Follow = require("../models/follow.model");
const User = require("../models/user.model");

/* ======================================================
   SEND FOLLOW REQUEST
   POST /api/users/follow/:username
====================================================== */
async function followUser(req, res) {
    try {
        const followerId = req.user.id;
        const { username } = req.params;

        const targetUser = await User.findOne({ username });
        if (!targetUser)
            return res.status(404).json({ message: "User not found" });

        if (targetUser._id.toString() === followerId)
            return res.status(400).json({ message: "You cannot follow yourself" });

        const existing = await Follow.findOne({
            follower: followerId,
            followee: targetUser._id
        });

        if (existing)
            return res.status(409).json({
                message: `Request already exists (${existing.status})`
            });

        await Follow.create({
            follower: followerId,
            followee: targetUser._id,
            status: "pending"
        });

        return res.status(201).json({ message: "Follow request sent" });

    } catch {
        return res.status(500).json({ message: "Internal server error" });
    }
}


/* ======================================================
   ACCEPT FOLLOW REQUEST
   POST /api/users/accept/:username
====================================================== */
async function acceptFollow(req, res) {
    try {
        const receiverId = req.user.id;
        const { username } = req.params;

        const sender = await User.findOne({ username });
        if (!sender)
            return res.status(404).json({ message: "User not found" });

        const updated = await Follow.findOneAndUpdate(
            {
                follower: sender._id,
                followee: receiverId,
                status: "pending"
            },
            { status: "accepted" },
            { returnDocument: "after" }
        );

        if (!updated)
            return res.status(404).json({ message: "Pending request not found" });

        return res.status(200).json({ message: "Follow accepted" });

    } catch {
        return res.status(500).json({ message: "Internal server error" });
    }
}


/* ======================================================
   REJECT FOLLOW REQUEST
   POST /api/users/reject/:username
====================================================== */
async function rejectFollow(req, res) {
    try {
        const receiverId = req.user.id;
        const { username } = req.params;

        const sender = await User.findOne({ username });
        if (!sender)
            return res.status(404).json({ message: "User not found" });

        const deleted = await Follow.findOneAndDelete({
            follower: sender._id,
            followee: receiverId,
            status: "pending"
        });

        if (!deleted)
            return res.status(404).json({ message: "Pending request not found" });

        return res.status(200).json({ message: "Follow rejected" });

    } catch {
        return res.status(500).json({ message: "Internal server error" });
    }
}


/* ======================================================
   UNFOLLOW USER
   POST /api/users/unfollow/:username
====================================================== */
async function unfollowUser(req, res) {
    try {
        const followerId = req.user.id;
        const { username } = req.params;

        const targetUser = await User.findOne({ username });
        if (!targetUser)
            return res.status(404).json({ message: "User not found" });

        const deleted = await Follow.findOneAndDelete({
            follower: followerId,
            followee: targetUser._id,
            status: "accepted"
        });

        if (!deleted)
            return res.status(404).json({ message: "Not following this user" });

        return res.status(200).json({ message: "Unfollowed successfully" });

    } catch {
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    followUser,
    acceptFollow,
    rejectFollow,
    unfollowUser
};
