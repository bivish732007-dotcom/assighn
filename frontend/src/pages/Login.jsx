import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Login({ switchToRegister, onLogin }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic frontend validation
    if (!form.email || !form.password) {
      setError("Please enter email and password");
      return;
    }

    if (!form.email.includes("@")) {
      setError("Please enter a valid email (e.g. yourname@gmail.com)");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // REAL backend login call
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Backend successful login -> data.user + data.token expect பண்ணுறோம்
      // 1) Browser localStorageல save பண்ணுறது (refresh பிறகும் user info இருக்கணும்)
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // 2) Parent componentக்கு தெரிவிக்கணும்னா
      if (onLogin) {
        onLogin(data.user);
      }

      setLoading(false);
      setError("");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <section className="hero">
        <h1 className="hero-title">Welcome to HealthSync</h1>
        <p className="hero-subtitle">
          Login to manage your medical records, medicines, lab reports and
          appointments in one place.
        </p>
        <div className="hero-tags">
          <span className="hero-tag">Secure Login</span>
          <span className="hero-tag">Patient Portal</span>
          <span className="hero-tag">Digital Health Records</span>
        </div>
      </section>

      <section style={{ maxWidth: "480px", marginTop: "1.2rem" }}>
        <h2 className="section-title">Patient Login</h2>
        <div className="card">
          <form onSubmit={handleSubmit} className="form-grid">
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
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p
            style={{
              fontSize: "0.85rem",
              color: "#9ca3af",
              marginTop: "0.75rem",
            }}
          >
            New patient?{" "}
            <span
              style={{ color: "#38bdf8", cursor: "pointer" }}
              onClick={switchToRegister}
            >
              Create account
            </span>
          </p>
        </div>
      </section>
    </>
  );
}

export default Login;