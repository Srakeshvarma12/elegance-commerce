import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/auth/password-reset/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!res.ok) {
        throw new Error("Request failed");
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md border p-8 text-center">

        {!success ? (
          <>
            <h1 className="text-3xl font-serif mb-6">
              Reset Password
            </h1>

            <p className="text-gray-600 mb-6">
              Enter your email and we’ll send a reset link.
            </p>

            {error && (
              <p className="text-red-600 text-sm mb-4">
                {error}
              </p>
            )}

            <form onSubmit={submit} className="space-y-4">
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border px-4 py-3 w-full"
              />

              <button
                disabled={loading}
                className="w-full border py-3 uppercase tracking-widest hover:bg-black hover:text-white transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (

          <div className="animate-fade-in">
            <div className="text-green-600 text-6xl mb-6">
              ✓
            </div>

            <h2 className="text-2xl font-serif mb-4">
              Check your email
            </h2>

            <p className="text-gray-600">
              We’ve sent a password reset link to
            </p>

            <p className="font-medium mt-2">
              {email}
            </p>

            <p className="text-sm text-gray-500 mt-6">
              Didn’t get it? Check spam or try again later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
