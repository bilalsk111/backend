import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: { 
      type: String, // ✅ use Google ID (sub/email)
      required: true 
    },

    messages: [
      {
        problem: { type: String, required: true },
        result: { type: Object, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);