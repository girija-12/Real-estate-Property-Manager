import React, { useState } from "react";
import axios from "axios";
import './Login.css'; // You can style your login form here

const Login = () => {
  // State for form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // State for error/success messages
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle form submit for login
  const handleLoginSubmit = (e) => {
    e.preventDefault();  // Prevent page reload

    const userData = {
      username,
      password
    };

    // Send login data to backend using axios
    axios
      .post("http://localhost:5000/login", userData)
      .then((response) => {
        localStorage.setItem("username", response.data.user.username);  // Store username
        localStorage.setItem("role", response.data.user.role);    // Store user role
        setSuccessMessage("Login successful!");
        setError("");

        // Redirect user based on role
        const role = response.data.user.role;
        if (role === "admin") {
          window.location.href = "/admin-dashboard";
        } else if (role === "manager") {
          window.location.href = "/manager-dashboard";
        } else if (role === "tenant") {
          window.location.href = "/tenant-dashboard";
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Error occurred during login.");
        setSuccessMessage(""); // Clear success message if error happens
      });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <form onSubmit={handleLoginSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      <p>Don't have an account? <a href="/signup">Sign up</a></p>
    </div>
  );
};

export default Login;
