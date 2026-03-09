const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "https://ik.imagekit.io/0dkbfujo9/avatar-default-user-profile-icon-simple-flat-vector-57234190.webp",
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const commentModel = mongoose.model('comments',commentSchema)

module.exports = commentModel