import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, checkAuth } from "../lib/auth";
import "../styles/admin.css";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth().then((user) => {
      if (user) navigate("/admin/dashboard", { replace: true });
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setLoading(true);

    try {
      await login(email, password);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-card">
        <div className="brand">
          <span className="brand__icon">✦</span>
          <span className="brand__name">Pearluneva</span>
        </div>

        <h1 className="title">Welcome Back</h1>
        <p className="subtitle">Please enter your administrative credentials</p>

        <form id="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              required
              placeholder="admin@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Secure Password</label>
            <input
              type="password"
              className="form-input"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner"></div> <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>

          {error && (
            <div className="error-msg">
              Authentication failed. Please check your credentials.
            </div>
          )}
        </form>

        <Link to="/" className="footer-link">
          ← Return to Public Store
        </Link>
      </div>
    </div>
  );
}
