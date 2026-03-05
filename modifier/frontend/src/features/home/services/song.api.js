import axios from 'axios'


const api = axios.create({
    baseURL:"http://localhost:3000/api/songs",
    withCredentials:true
})


export const uploadSong = async ()=>{
    const res = await api.post("/upload")
    return res.data
}
export const getSong = async ({ mood }) => {
    const res = await api.get('/song?mood=' + mood)
    return res.data
}