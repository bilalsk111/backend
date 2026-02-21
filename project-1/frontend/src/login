import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/form.scss";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { handlelogin, loading } = useAuth();
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "username" ? value.toLowerCase() : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await handlelogin(form.username, form.password);
      navigate("/");
    } catch (err) {
      setErrors({
        server:
          err.response?.data?.message || "Invalid credentials",
      });
    }
  };

  return (
    <main className="auth">
      <div className="auth-card">
        <h1 className="logo">Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
            />
            {errors.username && (
              <small className="error">{errors.username}</small>
            )}
          </div>

          <div className="input-group password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
            <span
              className="toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>

            {errors.password && (
              <small className="error">{errors.password}</small>
            )}
          </div>

          {errors.server && (
            <small className="error server">
              {errors.server}
            </small>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="switch">
          Don’t have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;