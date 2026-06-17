// src/App.jsx
import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import ProtectedView from "./components/ProtectedView";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState("login");

  // Load user from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {
        // ignore parse error
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setAuthView("login");
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setAuthView("login");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setAuthView("login");
  };

  return (
    <div className="app-root">
      <Navbar user={user} onLogout={handleLogout} />

      {!user ? (
        <main className="app-main">
          {authView === "login" ? (
            <Login
              switchToRegister={() => setAuthView("register")}
              onLogin={handleLogin}
            />
          ) : (
            <Register
              switchToLogin={() => setAuthView("login")}
              onRegister={handleRegister}
            />
          )}
        </main>
      ) : (
        <ProtectedView>
          <Dashboard user={user} />
        </ProtectedView>
      )}

      <footer className="app-footer">
        HealthSync · React Frontend with Login / Register · Ready for MERN
        backend.
      </footer>
    </div>
  );
}

export default App;