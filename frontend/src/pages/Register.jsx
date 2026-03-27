import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("auth/register/", { username, email, password });
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Please try again.");
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
          <h1 className="heading-md mb-2">Create your account</h1>
          <p className="text-sm text-text-muted">Join ELEGANCE to start shopping</p>
        </div>

        {/* Form */}
        <div className="card p-8 md:p-10">
          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            <div>
              <label className="form-label">Username</label>
              <input
                className="input"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
              />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Create a secure password"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-error text-center bg-error/5 py-2.5 rounded-lg">{error}</p>
            )}

            <LiquidButton
              size="xl"
              disabled={loading}
              onClick={handleRegister}
              className="!text-text-primary font-semibold w-full disabled:opacity-40"
            >
              {loading ? "Creating account..." : "Create Account"}
            </LiquidButton>
          </form>
        </div>

        <p className="text-center mt-8 text-sm text-text-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
