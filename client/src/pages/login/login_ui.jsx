import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";

const LoginPage = observer(({ userStore }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:8000/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      userStore.updateUser();
      window.location.href = "/";
    } catch (error) {
      console.error("Erreur de connexion :", error);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="login-page">
      <a href="/" className="login-title">
        GameVibe
      </a>
      <div className="login-content">
        <h1>Log In</h1>
        <form onSubmit={handleLogin}>
          <div className="login-input marge">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
              placeholder="Email"
              required
            />
          </div>
          <div className="login-input marge">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
              placeholder="Password"
              required
            />
          </div>
          <div className="login-error">
            {error && <span className="error">{error}</span>}
          </div>

          <div className="login-link marge">
            <span />
            <Link to="/register">Signup</Link>
          </div>
          <div className="login-button marge">
            <span />
            <button type="submit" className="button">
              Sign In
            </button>
            <span />
          </div>
        </form>
      </div>
    </div>
  );
});

export default LoginPage;
