import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-slideUp">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block text-2xl font-bold tracking-[-0.04em] mb-6">ELEGANCE</Link>
          <h1 className="heading-md mb-2">Reset your password</h1>
          <p className="text-sm text-text-muted">Enter your email and we'll send you a reset link</p>
        </div>

        <div className="card p-8 md:p-10">
          {!submitted ? (
            <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
              <div>
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className="input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <LiquidButton size="xl" className="!text-text-primary font-semibold w-full">
                Send Reset Link
              </LiquidButton>
            </form>
          ) : (
            <div className="text-center py-6 flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-success">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold mb-1">Check your email</p>
                <p className="text-sm text-text-muted">We've sent a password reset link to your email address.</p>
              </div>
              <LiquidButton size="default" onClick={() => navigate('/login')} className="!text-text-primary text-sm font-medium mt-2">Back to Sign In</LiquidButton>
            </div>
          )}
        </div>

        <p className="text-center mt-8 text-sm text-text-muted">
          <Link to="/login" className="text-text-primary font-medium hover:underline">Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}
