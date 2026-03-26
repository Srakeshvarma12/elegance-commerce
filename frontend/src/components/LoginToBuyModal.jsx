import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function LoginToBuyModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  // ---- SCROLL SAFETY ----
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
      className="
        fixed inset-0 
        backdrop-blur-sm bg-black/40
        flex items-center justify-center 
        z-50
        animate-fadeIn
      "
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[2rem] shadow-[var(--shadow-soft)] p-8 w-[420px] transform transition-all duration-300 scale-95 animate-modalPop"
        onClick={e => e.stopPropagation()}
      >
        {/* BRAND */}
        <h1 className="font-display text-2xl text-center mb-2 tracking-[0.4em] uppercase">
          Elegance
        </h1>

        <h2 className="text-lg font-medium text-center mb-3">
          Sign in to continue
        </h2>

        <p className="text-muted text-center mb-6 text-sm">
          You need to be logged in to add items to your cart or purchase products.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() =>
              navigate("/login", {
                state: { from: location.pathname + location.search },
              })
            }
            className="w-full bg-[var(--color-ink)] text-white py-3 uppercase tracking-[0.3em] text-xs hover:opacity-80 transition"
          >
            Sign in
          </button>

          <button
            onClick={() =>
              navigate("/register", {
                state: { from: location.pathname + location.search },
              })
            }
            className="w-full border border-black/20 py-3 uppercase tracking-[0.3em] text-xs hover:bg-black hover:text-white transition"
          >
            Create your account
          </button>

          <button
            onClick={onClose}
            className="text-muted mt-2 text-xs uppercase tracking-[0.3em] hover:text-black"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
