/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:8000/signup`,
        {
          username,
          email,
          password,
          repeatPassword,
        },
        {
          withCredentials: true,
        }
      );
      navigate("/login");
    } catch (error) {
      setError(
        error.response.data.message ??
          "Une erreur est survenue, veuillez réessayer plus tard."
      );
    }
  };
  return (
    <div className="login-page">
      <a href="/" className="login-title">
        GameVibe
      </a>
      <div className="login-content">
        <h1>Sign In</h1>
        <form onSubmit={handleSignUp}>
          <div className="login-input marge">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="email-input"
              placeholder="Username"
              required
            />
          </div>
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
          <div className="login-input marge">
            <input
              type="password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className="password-input"
              placeholder="Repeat Password"
              required
            />
          </div>
          <div className="login-error">
            {error ?? <span className="error">{error}</span>}
          </div>
          <div className="login-link marge">
            <span />
            <a href="/login">Sign In</a>
          </div>
          <div className="login-button marge">
            <span />
            <button type="submit" className="button">
              Signup
            </button>
            <span />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
