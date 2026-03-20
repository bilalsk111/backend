import express from "express";
import { sendmessage, getChats, getMessages, delChat, createChat, deleteMessage } from "../controllers/chat.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js"; 

const router = express.Router();

router.post("/message", authUser, upload.single("file"), sendmessage);

// Baaki routes waise hi rahenge
router.post("/new", authUser, createChat);
router.get("/chat", authUser, getChats);
router.get("/:chatId/messages", authUser, getMessages);
router.delete("/delete/:chatId", authUser, delChat);
router.delete("/message/:messageId", authUser, deleteMessage);

export default router;