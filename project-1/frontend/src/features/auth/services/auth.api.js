import axios from 'axios';

let api = axios.create({
    baseURL:'http://localhost:3000/api/auth',
    withCredentials:true,
})

export async function register(username,email,password){
    let res = await api.post('/register',{
        username,email,password
    })
    return res.data
}
export async function login(username,password){
    let res = await api.post('/login',{
        username,password
    })
    return res.data
}
export async function GetMe(){
    let res = await api.get('/get-me')
    return res.data
}