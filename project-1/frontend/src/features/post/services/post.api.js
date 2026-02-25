import axios from 'axios'

let api = axios.create({
    baseURL:'http://localhost:3000/api',
    withCredentials:true
})

export async function GetFeed(){
    let res = await api.get('/posts/feed')
    return res.data
}

export async function toggleLike(postId) {
    const res = await api.post(`/posts/like/${postId}`);
    return res.data;
}
export async function GetLikes(postId) {
    const res = await api.get(`/posts/likes/${postId}`)
    return res.data
}

export const createPost = async (formData) =>{
    const res = await api.post('/posts/create',formData,{
        headers: {'Content-Type': "multipart/form-data"}
    })
    return res.data
}
