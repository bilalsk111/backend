import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import "../style/form.scss";

const Register = () => {
  const { handleRegister, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "email" ? value.toLowerCase() : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleRegister(form.username.trim(), form.email.trim(), form.password);
      navigate("/");
    } catch (err) {
      setErrors({ server: err.response?.data?.message || "Registration failed" });
    }
  };

  return (
    <main className="auth">
           <div className="img-div">
        <p>See everyday moments from your <span>close friends.</span></p>
        <img src="/pAv7hjq-51n.png" alt="Insta Branding" />
      </div>
      <div className="auth-card">
        <h1 className="logo">Create Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group"><FiUser className="icon" /><input name="username" placeholder="Username" value={form.username} onChange={handleChange} /></div>
          <div className="input-group"><FiMail className="icon" /><input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} /></div>
          <div className="input-group">
            <FiLock className="icon" /><input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={form.password} onChange={handleChange} />
            <span className="toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FiEyeOff /> : <FiEye />}</span>
          </div>
          {errors.server && <small className="error">{errors.server}</small>}
          <button type="submit" disabled={loading}>{loading ? "Creating..." : "Sign Up"}</button>
        </form>
        <p className="switch">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </main>
  );
};

export default Register;