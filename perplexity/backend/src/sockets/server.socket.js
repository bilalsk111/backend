import { Server } from "socket.io";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
    maxHttpBufferSize: 1e7,
  });

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    socket.on("join-chat", (chatId) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined chat: ${chatId}`);
    });

    socket.on("leave-chat", (chatId) => {
      socket.leave(chatId);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}