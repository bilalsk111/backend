import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'

const Register = () => {
    const {loading,handleRegister} = useAuth()
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    })
    const handleSubmit = (e)=>{
        e.preventDefault()
        const {username,email,password} = formData
        handleRegister(username,email,password)
        console.log(formData);
    }
  return (
    <div>
      <form onSubmit={handleSubmit} >
        <input type="text" placeholder="Username" value={formData.username} onChange={(e)=>setFormData({...formData,username:e.target.value})} />
        <input type="email" placeholder="Email" value={formData.email} onChange={(e)=>setFormData({...formData,email:e.target.value})} />
        <input type="password" placeholder="Password" value={formData.password} onChange={(e)=>setFormData({...formData,password:e.target.value})} />
        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Register
