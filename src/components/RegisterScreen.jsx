import React, { useState } from "react";
import "./RegisterScreen.css";

const RegisterScreen = ({ onRegister, onSwitchToLogin }) => {
  // Default role is "Member"
  const [form, setForm] = useState({
    name: "",
    phonenumber: "",
    password: "",
    role: "USER",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate all fields
    if (!form.name || !form.phonenumber || !form.password || !form.role) {
      setError("Please fill all fields");
      return;
    }

    try {
      await onRegister(form);
      setSuccess("Registration successful!");
      // Optionally reset form
      setForm({
        name: "",
        phonenumber: "",
        password: "",
        role: "USER",
      });
    } catch (err) {
      setError(err.response?.data || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Register</h2>

        {error && <div className="register-error">{error}</div>}
        {success && <div className="register-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Role Selector */}
          <div className="form-group user-role">
            <label>Select Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="USER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Name */}
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              placeholder="Enter your phone number"
              value={form.phonenumber}
              onChange={(e) => setForm({ ...form, phonenumber: e.target.value })}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>

        <div className="switch-login-container">
          <p>
            Already have an account?{" "}
            <button className="switch-btn" onClick={onSwitchToLogin} type="button">
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
