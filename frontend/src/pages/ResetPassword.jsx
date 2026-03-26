import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async e => {
    e.preventDefault();
    setError("");

    try {
      await api.post(`/auth/password-reset-confirm/${uid}/${token}/`, {
        password,
      });

      setSuccess("Password reset successful");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 pt-24 pb-20">
      <form
        onSubmit={submit}
        className="w-full max-w-md p-8 border border-black/10 bg-white shadow-[var(--shadow-soft-tight)]"
      >
        <p className="uppercase tracking-[0.3em] text-xs text-muted text-center">
          Password Reset
        </p>
        <h1 className="font-display text-2xl text-center mt-4 mb-6">
          Set a new password
        </h1>

        {error && <p className="text-red-600 mb-3">{error}</p>}
        {success && <p className="text-green-600 mb-3">{success}</p>}

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border border-black/10 px-4 py-3 w-full text-sm"
          required
        />

        <button className="mt-6 w-full bg-[var(--color-ink)] text-white py-3 uppercase tracking-[0.3em] text-xs hover:opacity-80 transition">
          Reset Password
        </button>
      </form>
    </div>
  );
}
