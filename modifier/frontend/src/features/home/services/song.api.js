import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true
});

export const uploadSong = async (formData) => {
  const res = await api.post("/songs/upload", formData);
  return res.data;
};

export const getSong = async ({ mood }) => {
  const res = await api.get(`/songs/song?mood=${mood}`);
  return res.data;
};