import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export default function LoginToBuyModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-8 w-[400px] max-w-[90vw] animate-modalPop"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold tracking-tight mb-2">Sign in to continue</h2>
          <p className="text-sm text-text-muted">
            You need an account to add items to your cart or make a purchase.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <LiquidButton
            size="xl"
            onClick={() => { navigate("/login", { state: { from: location.pathname + location.search } }); }}
            className="!text-text-primary font-semibold w-full"
          >
            Sign In
          </LiquidButton>
          <LiquidButton
            size="lg"
            onClick={() => { navigate("/register", { state: { from: location.pathname + location.search } }); }}
            className="!text-text-secondary font-medium w-full"
          >
            Create Account
          </LiquidButton>
          <LiquidButton
            size="default"
            onClick={onClose}
            className="!text-text-muted w-full mt-1"
          >
            Cancel
          </LiquidButton>
        </div>
      </div>
    </div>
  );
}
