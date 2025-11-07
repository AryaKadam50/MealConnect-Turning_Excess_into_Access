import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    // Redirect if already logged in - go back to home
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (user.role === 'restaurant') {
        navigate('/restaurant-dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      // Only redirect to dashboards for admin/restaurant, regular users go to home
      if (data?.role === 'admin') {
        navigate("/admin-dashboard");
      } else if (data?.role === 'restaurant') {
        navigate("/restaurant-dashboard");
      } else {
        // Regular users go to home page (same dashboard)
        navigate("/");
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
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

        <button type="submit" className="btn-primary">Login</button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
      
      <p style={{ marginTop: '1rem' }}>
        <Link to="/" style={{ color: '#f97316', textDecoration: 'none', fontWeight: 500 }}>
          ← Back to Home
        </Link>
      </p>
    </div>
  );
}
