import { useState } from "react";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const submit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/password-reset/", { email });
      setSuccess(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 pt-24 pb-20">
      <div className="w-full max-w-md border border-black/10 bg-white p-8 text-center shadow-[var(--shadow-soft-tight)]">
        {!success ? (
          <>
            <p className="uppercase tracking-[0.3em] text-xs text-muted">
              Password Reset
            </p>
            <h1 className="font-display text-3xl mt-4 mb-6">
              Reset your password
            </h1>

            <p className="text-muted mb-6 text-sm">
              Enter your email and we will send a reset link.
            </p>

            {error && (
              <p className="text-red-600 text-sm mb-4">{error}</p>
            )}

            <form onSubmit={submit} className="space-y-4">
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="border border-black/10 px-4 py-3 w-full text-sm"
              />

              <button
                disabled={loading}
                className="w-full border border-black/20 py-3 uppercase tracking-[0.3em] text-xs hover:bg-black hover:text-white transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <div className="animate-fadeIn">
            <div className="text-[var(--color-gold)] text-4xl mb-6">
              Reset link sent
            </div>

            <h2 className="font-display text-2xl mb-4">
              Check your inbox
            </h2>

            <p className="text-muted text-sm">
              We sent a password reset link to:
            </p>

            <p className="font-medium mt-2">{email}</p>

            <p className="text-xs text-muted mt-6">
              If it is not there, check spam or try again later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
