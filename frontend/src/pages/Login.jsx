import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("auth/login/", { username, password });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("username", username);
      const from = location.state?.from || "/profile";
      navigate(from);
      window.location.reload();
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-slideUp">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block text-2xl font-bold tracking-[-0.04em] mb-6">ELEGANCE</Link>
          <h1 className="heading-md mb-2">Welcome back</h1>
          <p className="text-sm text-text-muted">Sign in to your account to continue</p>
        </div>

        {/* Form */}
        <div className="card p-8 md:p-10">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="form-label">Username</label>
              <input
                className="input"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="form-label !mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-text-muted hover:text-text-primary transition-colors">Forgot password?</Link>
              </div>
              <input
                type="password"
                className="input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-error text-center bg-error/5 py-2.5 rounded-lg">{error}</p>
            )}

            <LiquidButton
              size="xl"
              disabled={loading}
              onClick={handleLogin}
              className="!text-text-primary font-semibold w-full disabled:opacity-40"
            >
              {loading ? "Signing in..." : "Sign In"}
            </LiquidButton>
          </form>
        </div>

        <p className="text-center mt-8 text-sm text-text-muted">
          Don't have an account?{" "}
          <Link to="/register" className="text-text-primary font-medium hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
