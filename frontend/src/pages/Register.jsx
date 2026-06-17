// src/pages/Register.jsx
import { useState } from "react";

const API_BASE_URL = "http://localhost:5000";

function Register({ switchToLogin, onRegister }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill all fields");
      return;
    }
    if (!form.email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      // save user + token from JWT backend
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (onRegister) {
        onRegister(data.user);
      }

      setLoading(false);
      setError("");
    } catch (err) {
      console.error("Register error:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <section className="hero">
        <h1 className="hero-title">Create your HealthSync account</h1>
        <p className="hero-subtitle">
          Sign up as a patient to store prescriptions, lab reports and
          appointments securely.
        </p>
        <div className="hero-tags">
          <span className="hero-tag">Patient Signup</span>
          <span className="hero-tag">Secure Data</span>
        </div>
      </section>

      <section style={{ maxWidth: "480px", marginTop: "1.2rem" }}>
        <h2 className="section-title">Register</h2>
        <div className="card">
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-row">
              <label className="form-label">Name</label>
              <input
                className="form-input"
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Email (Gmail)</label>
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="you@gmail.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                name="password"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Confirm Password</label>
              <input
                className="form-input"
                type="password"
                name="confirmPassword"
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p
            style={{
              fontSize: "0.85rem",
              color: "#9ca3af",
              marginTop: "0.75rem",
            }}
          >
            Already have an account?{" "}
            <span
              style={{ color: "#38bdf8", cursor: "pointer" }}
              onClick={switchToLogin}
            >
              Login
            </span>
          </p>
        </div>
      </section>
    </>
  );
}

export default Register;