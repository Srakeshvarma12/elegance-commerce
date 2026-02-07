import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1) LOGIN FIRST
      const res = await api.post("/auth/login/", {
        username,
        password,
      });

      const data = res.data;

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("username", username);

      // 2) NOW GET PROFILE — ✅ CORRECT ENDPOINT
      const profileRes = await api.get("/auth/profile/", {
        headers: {
          Authorization: `Bearer ${data.access}`,
        },
      });

      const user = profileRes.data;

      // ✅ Store admin flag for Navbar
      localStorage.setItem("is_admin", user.is_admin ? "true" : "false");

      navigate("/", { replace: true });

    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-md">

        <h1 className="text-3xl font-serif mb-8 text-center tracking-widest">
          Login
        </h1>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="border border-black px-4 py-3 outline-none"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="border border-black px-4 py-3 w-full outline-none pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            disabled={loading}
            className="border border-black py-3 mt-4 uppercase tracking-widest text-sm hover:bg-black hover:text-white transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
}
