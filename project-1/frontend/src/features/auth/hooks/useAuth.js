import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login,register,logout } from "../services/auth.api";
import { useNavigate } from "react-router-dom";

export const useAuth = ()=>{
    const navigate = useNavigate();
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
      const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/login"); // ✅ redirect
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

    return{
        user,loading,handlelogin,handleRegister, handleLogout
    }
}