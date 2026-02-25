import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import "../style/form.scss";

const Register = () => {
  const { handleRegister, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

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
    if (!form.username.trim()) newErrors.username = "Username required";
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
        form.password
      );
      navigate("/");
    } catch (err) {
      setErrors({
        server: err.response?.data?.message || "Registration failed",
      });
    }
  };

  return (
    <main className="auth">
      <div className="auth-card">
        <h1 className="logo">Create Account</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FiUser className="icon" />
            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
            />
          </div>
          {errors.username && <small className="error">{errors.username}</small>}

          <div className="input-group">
            <FiMail className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && <small className="error">{errors.email}</small>}

          <div className="input-group">
            <FiLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
            <span
              className="toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
          {errors.password && <small className="error">{errors.password}</small>}

          {errors.server && <small className="error server">{errors.server}</small>}

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
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