const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const { username, email, password, name, bio, profileImage } = req.body;
    const existingUser = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(409).json({
        message:
          existingUser.email === email
            ? "Email already exists"
            : "Username already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      username,
      email,
      password: hash,
      name,
      bio,
      profileImage,
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "1d",
    });

    res.cookie("token", token, { httpOnly: true });
    res.status(201).json({
      message: "User registered successfully",
      user: {
        username: user.username,
        email: user.email,
        bio: user.bio,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during registration" });
  }
};

const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) return res.status(401).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "1d",
    });
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        bio: user.bio,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
};

const GetMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerController, loginController, GetMe };
