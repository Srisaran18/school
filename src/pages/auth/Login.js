import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiBookOpen } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div className="login-shell">
        <div className="login-loading">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="login-bg-pattern login-bg-pattern--top" aria-hidden="true" />
      <div className="login-bg-pattern login-bg-pattern--bottom" aria-hidden="true" />

      <div className="login-card">
        <div className="login-brand">
          <div
            className="login-brand__image"
            style={{
              backgroundImage:
                "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-_SsjwHvWyleKec0W9FoPYTScH6JnfWk7mJJecsMCQw&s=10')",
            }}
          />
          <div className="login-brand__overlay">
            <h1 className="login-brand__title">Greenwood School</h1>
            <p className="login-brand__tagline">
              Education is the passport to the future, for tomorrow belongs to those who prepare for it today.
            </p>
          </div>
        </div>

        <div className="login-form-panel">
          <div className="login-form-panel__icon" aria-hidden="true">
            <FiBookOpen />
          </div>

          <h2 className="login-form-panel__title">Welcome</h2>
          <p className="login-form-panel__subtitle">Login with Email</p>

          {error && <div className="login-alert">{error}</div>}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="email">Email Id</label>
              <div className="login-field__control">
                <FiMail className="login-field__icon" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="login-field__control">
                <FiLock className="login-field__icon" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Signing in..." : "LOGIN"}
            </button>
          </form>

          <div className="login-decor" aria-hidden="true">
            <span className="login-decor__item">📚</span>
            <span className="login-decor__item">🎓</span>
            <span className="login-decor__item">🏫</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
