import { io } from "socket.io-client";

let socket = null;

export const initSocketConnection = () => {
  if (socket?.connected) return socket;

  socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000", {
    withCredentials: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.warn("Socket connection error:", err.message);
  });

  return socket;
};

export const getSocket = () => socket;

export const joinChat = (chatId) => {
  if (socket && chatId) socket.emit("join-chat", chatId);
};

export const leaveChat = (chatId) => {
  if (socket && chatId) socket.emit("leave-chat", chatId);
};