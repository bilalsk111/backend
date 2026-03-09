import axios from 'axios'

let api = axios.create({
    baseURL:'http://localhost:5000/api',
    withCredentials:true
})

export const login = async(username,password)=>{
const res = await api.post('auth/login',{username,password})
return res.data
}
export const register = async(username,email,password)=>{
const res = await api.post('auth/register',{username,email,password})
return res.data
}