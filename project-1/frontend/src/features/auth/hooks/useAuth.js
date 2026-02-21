import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login,register } from "../services/auth.api";


export const useAuth = ()=>{
    let context = useContext(AuthContext)
    let {user,setUser,loading,setLoading} = context

    const  handlelogin = async (username,password) =>{
        setLoading(true)

        let res = await login(username,password)
        setUser(res.user)
        setLoading(false)
    }
    const  handleRegister = async (username,email,password) =>{
        setLoading(true)

        let res = await register(username,email,password)
        setUser(res.user)
        setLoading(false)
    }
    return{
        user,loading,handlelogin,handleRegister
    }
}