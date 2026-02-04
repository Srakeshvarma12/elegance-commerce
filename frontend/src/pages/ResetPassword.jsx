import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";   // ✅ REQUIRED

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post(
        `/auth/password-reset-confirm/${uid}/${token}/`,
        { password }
      );

      setSuccess("Password reset successful");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.error || "Reset failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-md p-8 border">
        <h1 className="text-2xl font-serif mb-6">Reset Password</h1>

        {error && <p className="text-red-600 mb-3">{error}</p>}
        {success && <p className="text-green-600 mb-3">{success}</p>}

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-4 py-3 w-full"
          required
        />

        <button className="mt-6 w-full bg-black text-white py-3 uppercase">
          Reset Password
        </button>
      </form>
    </div>
  );
}
