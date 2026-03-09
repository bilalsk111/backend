import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import "../style/form.scss";

const Login = () => {
  const { loading, handlelogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "username" ? value.toLowerCase() : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setErrors({ server: "All fields are required" });
      return;
    }
    try {
      await handlelogin(form.username.trim(), form.password);
      navigate("/feed");
    } catch (err) {
      setErrors({ server: err.response?.data?.message || "Invalid credentials" });
    }
  };

  return (
    <main className="auth">
      <div className="img-div">
        <p>See everyday moments from your <span>close friends.</span></p>
        <img src="/pAv7hjq-51n.png" alt="Insta Branding" />
      </div>

      <div className="auth-card">
        <h1 className="logo">Welcome Back</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FiUser className="icon" />
            <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} />
          </div>
          <div className="input-group">
            <FiLock className="icon" />
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={form.password} onChange={handleChange} />
            <span className="toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
          {errors.server && <small className="error">{errors.server}</small>}
          <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Log In"}</button>
        </form>
        <p className="switch">Don't have an account? <Link to="/register">Sign up</Link></p>
      </div>
    </main>
  );
};

export default Login;