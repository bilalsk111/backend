import React from "react";
import "../style/form.scss";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    axios
      .post(
        "http://localhost:3000/api/register",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        },
      )
      .then((res) => console.log(res.data));
  }

  return (
    <main className="auth">
      <div className="auth-card">
        <h1 className="logo">Log in</h1>

        <form onSubmit={handleSubmit}>
          <input
            onInput={(e) => {
              setUsername(e.target.value);
            }}
            name="username"
            type="text"
            placeholder="Username"
          />
          <input
            onInput={(e) => {
              setPassword(e.target.value);
            }}
            name="password"
            type="password"
            placeholder="Password"
          />

          <button type="submit">Log in</button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

         <p className="switch">
          Don’t have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
