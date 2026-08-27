import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = ({ loginType }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  if (authLoading) {
    return <div className="login-page min-vh-100 d-flex align-items-center justify-content-center text-white">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const isStaffLogin = loginType === "staff";
  const title = isStaffLogin ? "Staff & Admin Login" : "Student Login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password, loginType);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow login-card">
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h3 className="fw-bold text-primary">School Management</h3>
            <p className="text-muted mb-0">{title}</p>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isStaffLogin ? "admin@school.com" : "student@school.com"}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="text-center mt-3">
            {isStaffLogin ? (
              <Link to="/login/student">Student Login</Link>
            ) : (
              <Link to="/login/staff">Staff / Admin Login</Link>
            )}
          </div>

          {isStaffLogin && (
            <p className="text-muted small text-center mt-3 mb-0">
              Default admin: admin@school.com / admin123
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
