import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

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
      await api.post(`/auth/password-reset-confirm/${uid}/${token}/`, { password });
      setSuccess("Password updated successfully.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Reset failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-slideUp">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block text-2xl font-bold tracking-[-0.04em] mb-6">ELEGANCE</Link>
          <h1 className="heading-md mb-2">Set new password</h1>
          <p className="text-sm text-text-muted">Choose a strong password for your account</p>
        </div>

        <div className="card p-8 md:p-10">
          <form onSubmit={submit} className="flex flex-col gap-5">
            <div>
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your new password"
                required
              />
            </div>

            {error && <p className="text-sm text-error text-center bg-error/5 py-2.5 rounded-lg">{error}</p>}
            {success && <p className="text-sm text-success text-center bg-success/5 py-2.5 rounded-lg">{success}</p>}

            <LiquidButton size="xl" className="!text-text-primary font-semibold w-full">
              Update Password
            </LiquidButton>
          </form>
        </div>
      </div>
    </div>
  );
}
