import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true
});

export async function register(username, email, password) {
    const res = await api.post('/register', { username, email, password });
    
    return res.data;

}

export async function login(username, password) {
    const res = await api.post('/login', { username, password });
    console.log(res.data);
    
    return res.data;
}

export async function GetMe() {
    const res = await api.get('/get-me');
    return res.data;
}