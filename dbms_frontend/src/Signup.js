import React, { useState } from "react";
import axios from "axios";
import './Signup.css'; // Import the CSS file

const Signup = () => {
  // State to handle form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [fullName, setFullName] = useState("");  // Add full_name
  const [phoneNumber, setPhoneNumber] = useState("");  // Add phone_number

  // State for error handling
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();  // Prevent page reload

    const userData = {
      username,
      password,
      email,
      role,
      full_name: fullName,  // Send full_name
      phone_number: phoneNumber,  // Send phone_number
    };

    // Send data to backend using axios
    axios
      .post("http://localhost:5000/signup", userData)
      .then((response) => {
        // Handle success
        setSuccessMessage("User registered successfully!");
        setError(""); // Clear error if signup is successful
      })
      .catch((err) => {
        // Handle error
        setError("Error occurred during signup.");
        setSuccessMessage(""); // Clear success message if error happens
      });
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {/* Display success or error messages */}
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">Select Role</option>
          <option value="tenant">Tenant</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
        </select>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
