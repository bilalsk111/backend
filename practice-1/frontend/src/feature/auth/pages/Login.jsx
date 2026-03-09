import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
  const {handlelogin} = useAuth();
  const [form,setForm] = useState({
    username:"",
    password:""
  })
  const handleSubmit = (e)=>{
    e.preventDefault()
    const {username,password} = form
        handlelogin(username,password)
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={form.username} onChange={(e)=>setForm({...form,username:e.target.value})} />
        <input type="password" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login
