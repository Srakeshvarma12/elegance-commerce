import { useUserStore } from "../store/userStore";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { register } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(username, email, password);
      navigate("/login", { state: { from: location.state?.from } });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 flex justify-center">
      <div className="w-full max-w-lg bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-black/5 p-12 shadow-[var(--shadow-soft)]">
        <header className="mb-10 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted mb-4 opacity-70">Register</p>
          <h1 className="text-4xl font-display mb-4 text-ink">Join Elegance</h1>
          <p className="text-muted text-sm leading-relaxed max-w-[280px] mx-auto">
            Experience refined shopping with a personal touch.
          </p>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-muted mb-3 ml-1">Username</label>
            <input
              className="w-full bg-black/5 border-none px-5 py-4 rounded-2xl text-sm focus:ring-1 ring-ink/20 outline-none transition"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-muted mb-3 ml-1">Email</label>
            <input
              className="w-full bg-black/5 border-none px-5 py-4 rounded-2xl text-sm focus:ring-1 ring-ink/20 outline-none transition"
              placeholder="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-muted mb-3 ml-1">Password</label>
            <input
              className="w-full bg-black/5 border-none px-5 py-4 rounded-2xl text-sm focus:ring-1 ring-ink/20 outline-none transition"
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            disabled={loading}
            className="btn-elegant w-full py-5 mt-4 text-[10px] bg-ink text-white hover:bg-ink/90 shadow-lg shadow-black/10 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-10 text-center text-xs text-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-ink font-medium tracking-wide border-b border-ink/30 pb-0.5 hover:border-ink transition ml-1">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
