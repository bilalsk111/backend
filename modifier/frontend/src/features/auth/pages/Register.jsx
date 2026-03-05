import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import '../style/register.scss';
import InputField from '../components/InputField';

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { handleRegister } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleRegister({ username, email, password });
            navigate("/");
        } catch (error) {
            alert(error.response?.data?.message || "Register failed");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                <InputField 
                    type='text'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    Icon={User}
                />

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
                

                    <button type='submit'>Register Now</button>
                </form>
                <p className="auth-footer">
                    Already have an account? <span className='link' onClick={() => navigate('/login')}>Login</span>
                </p>
            </div>
        </div>
    );
};

export default Register;