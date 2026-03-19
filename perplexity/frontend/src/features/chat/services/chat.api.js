import axios  from "axios";


const api = axios.create({
baseURL:"http://localhost:3000/api/chats",
withCredentials:true
})

export async function sendMessage({message,chatId}){
    const res = await api.post("/message",{message,chatId})
    return res.data
}
export async function getChats(){
    const res = await api.get("/chat")
    return res.data
}

export async function getMessages(chatId) {
    const res = await api.get(`/${chatId}/messages`)
    return res.data
}
export async function delChat(chatId) {
    const res = await api.delete(`delete/${chatId}`)
    return res.data
}

export async function createChat() {
    const res = await api.post("/new");
    return res.data;
}