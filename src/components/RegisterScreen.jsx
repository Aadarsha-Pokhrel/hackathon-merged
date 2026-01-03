import React, { useState } from "react";
import "./RegisterScreen.css";

const RegisterScreen = ({ onRegister, onSwitchToLogin }) => {
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.phone || !form.password) {
      setError("Please fill all fields");
      return;
    }

    onRegister(form);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Register</h2>

        {error && <div className="register-error">{error}</div>}
        {success && <div className="register-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" placeholder="Enter your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input type="text" placeholder="Enter your phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>

          <button type="submit" className="register-btn">Register</button>
        </form>

        <div className="switch-login-container">
          <p>
            Already have an account?{" "}
            <button className="switch-btn" onClick={onSwitchToLogin} type="button">Login</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
