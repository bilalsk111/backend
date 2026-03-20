import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chat: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Chat", 
    required: true 
  },
  content: { 
    type: String 
  },
  role: { 
    type: String, 
    enum: ["user", "ai"], 
    required: true 
  },
  fileUrl: { 
    type: String, 
    default: null 
  } ,
  fileType: { type: String },
fileName: { type: String },
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);