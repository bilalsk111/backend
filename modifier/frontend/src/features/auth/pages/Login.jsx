import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../style/login.scss';
import InputField from '../components/InputField';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'; // Icons import

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    const navigate = useNavigate();
    const { handleLogin } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await handleLogin({ email, password });
            if (response) navigate("/");
        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Welcome Back</h2>
                <form onSubmit={handleSubmit}>
                <InputField 
                    type='email'
                    placeholder='Email Address'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    Icon={Mail}
                />
                <InputField 
                type={showPassword ? "text" : "password"}
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                Icon={Lock}
                rightElement={
                    <div className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                    </div>
                }
                />
                    <button type='submit'>Sign In</button>
                </form>
                <p className="auth-footer">
                    Don't have an account? <span className='link'  onClick={() => navigate('/register')}>Register</span>
                </p>
            </div>
        </div>
    );
};

export default Login;