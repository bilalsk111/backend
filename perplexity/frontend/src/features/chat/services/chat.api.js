import axios from "axios";
import { getSocket } from "./chat.socket";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/chats`,
  withCredentials: true,
});

// Response interceptor for error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export async function sendMessage({ message, chatId, file }) {
  const formData = new FormData();
  if (message?.trim()) formData.append("message", message.trim());
  if (chatId) formData.append("chatId", chatId);
  if (file) formData.append("file", file);

  const socket = getSocket();
  if (socket?.id) formData.append("socketId", socket.id);

  const res = await api.post("/message", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 120000, // 2 min for large files
  });
  return res.data;
}

export async function getChats() {
  const res = await api.get("/chat");
  return res.data;
}

export async function getMessages(chatId) {
  const res = await api.get(`/${chatId}/messages`);
  return res.data;
}

export async function delChat(chatId) {
  const res = await api.delete(`delete/${chatId}`);
  return res.data;
}

export async function createChat() {
  const res = await api.post("/new");
  return res.data;
}

export async function updateTitle(chatId, title) {
  const res = await api.patch(`/${chatId}/title`, { title });
  return res.data;
}