import { geminiairesponse, chatTitle } from "../services/ai.service.js";
import { uploadFile } from "../services/upload.service.js";
import { getIO } from "../sockets/server.socket.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import mongoose from "mongoose";

export async function sendmessage(req, res) {
  try {
    const { message, chatId } = req.body;

    if (!message && !req.file) {
      return res.status(400).json({ message: "Message or file required" });
    }

    // Find or create chat
    let chat;
    if (chatId && mongoose.Types.ObjectId.isValid(chatId)) {
      chat = await chatModel.findOne({ _id: chatId, user: req.user.id });
    }

    const isNewChat = !chat;

    if (!chat) {
      chat = await chatModel.create({
        user: req.user.id,
        title: await chatTitle(message || "File Analysis"),
      });
    }

    // Handle file upload
    let fileUrl = null;
    let fileType = null;
    let fileName = null;

    if (req.file) {
      const uploaded = await uploadFile({
        buffer: req.file.buffer,
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
      });
      fileUrl = uploaded.url;
      fileType = req.file.mimetype;
      fileName = req.file.originalname;
    }

    // Save user message
    const userMessage = await messageModel.create({
      chat: chat._id,
      content: message || (fileUrl ? "Please analyze this file." : ""),
      role: "user",
      fileUrl,
      fileType,
      fileName,
    });

    // Update chat timestamp
    await chatModel.findByIdAndUpdate(chat._id, { updatedAt: new Date() });

    // Get full message history
    const messages = await messageModel
      .find({ chat: chat._id })
      .sort({ createdAt: 1 })
      .lean();

    const io = getIO();

    // Stream AI response
    const full = await geminiairesponse(messages, (chunk) => {
      io.to(chat._id.toString()).emit(`stream-${chat._id}`, chunk);
    });

    // Save AI message
    const aiMessage = await messageModel.create({
      chat: chat._id,
      content: full,
      role: "ai",
    });

    // Emit done signal
    io.to(chat._id.toString()).emit(`stream-done-${chat._id}`, {
      aiMessageId: aiMessage._id,
    });

    res.json({
      chatId: chat._id,
      isNewChat,
      chat: { _id: chat._id, title: chat.title },
      userMessage,
      aiMessage,
    });
  } catch (err) {
    console.error("sendmessage error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

export async function getChats(req, res) {
  try {
    const chats = await chatModel
      .find({ user: req.user.id })
      .sort({ updatedAt: -1 })
      .lean();
    res.status(200).json({ chats });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch chats" });
  }
}

export async function getMessages(req, res) {
  try {
    const { chatId } = req.params;
    const chat = await chatModel.findOne({ _id: chatId, user: req.user.id });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    const messages = await messageModel
      .find({ chat: chatId })
      .sort({ createdAt: 1 })
      .lean();

    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
}

export async function delChat(req, res) {
  try {
    const { chatId } = req.params;
    const chat = await chatModel.findOneAndDelete({ _id: chatId, user: req.user.id });
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    await messageModel.deleteMany({ chat: chatId });
    res.status(200).json({ message: "Chat deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete chat" });
  }
}

export async function deleteMessage(req, res) {
  try {
    const { messageId } = req.params;
    const message = await messageModel.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    const chat = await chatModel.findOne({ _id: message.chat, user: req.user.id });
    if (!chat) return res.status(403).json({ message: "Unauthorized" });

    await messageModel.findByIdAndDelete(messageId);
    res.status(200).json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete message" });
  }
}

export const createChat = async (req, res) => {
  try {
    const chat = await chatModel.create({
      user: req.user.id,
      title: "New Chat",
    });
    res.status(201).json({ chat });
  } catch (err) {
    res.status(500).json({ message: "Failed to create chat" });
  }
};

export async function updateChatTitleHandler(req, res) {
  try {
    const { chatId } = req.params;
    const { title } = req.body;
    const chat = await chatModel.findOneAndUpdate(
      { _id: chatId, user: req.user.id },
      { title },
      { new: true }
    );
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.status(200).json({ chat });
  } catch (err) {
    res.status(500).json({ message: "Failed to update title" });
  }
}