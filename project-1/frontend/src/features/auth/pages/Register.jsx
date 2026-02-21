import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../style/form.scss";

const Register = () => {
  const { handleRegister, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "email" ? value.toLowerCase() : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let newErrors = {};
    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email";
    if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(form.password))
      newErrors.password = "8+ chars, 1 uppercase & 1 number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await handleRegister(
        form.username.trim(),
        form.email.trim(),
        form.password,
      );
      navigate("/feed");
    } catch (err) {
      setErrors({
        server: err.response?.data?.message || "Registration failed",
      });
    }
  };

  return (
    <main className="auth">
      <div className="auth-card">
        <h1 className="logo">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
            />
            {errors.username && (
              <small className="error">{errors.username}</small>
            )}
          </div>
          <div className="input-group">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
            />
            {errors.email && <small className="error">{errors.email}</small>}
          </div>
          <div className="input-group password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
            />
            <span
              className="toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
            {errors.password && (
              <small className="error">{errors.password}</small>
            )}
          </div>
          {errors.server && (
            <small className="error server">{errors.server}</small>
          )}
          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>
        <p className="switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
