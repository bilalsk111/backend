const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      default: "",
    },
    mediaUrl: {
      type: String,
      required: [true, "mediaUrl is required for creating a post"],
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required for creating a post"],
    },
  },
  { timestamps: true }
);

const postModel = mongoose.model("Post", postSchema);

module.exports = postModel;