import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  email: String,
  avatar: String,
});

const userModel = mongoose.model("User", userSchema);

export default userModel;