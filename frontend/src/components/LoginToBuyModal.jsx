import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginToBuyModal({ isOpen, onClose }) {
  const navigate = useNavigate();

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
        className="
          bg-white rounded-2xl shadow-xl p-8 
          w-[420px] 
          transform transition-all duration-300
          scale-95 animate-modalPop
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* BRAND */}
        <h1 className="text-2xl font-bold text-center mb-2 tracking-wide">
          ÉLÉGANCE
        </h1>

        <h2 className="text-xl font-semibold text-center mb-3">
          Sign in to continue
        </h2>

        <p className="text-gray-600 text-center mb-6">
          You need to be logged in to add items to your cart or purchase products.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/login")}
            className="
              w-full bg-black text-white py-2.5 rounded-lg
              hover:bg-gray-900 transition
            "
          >
            Sign in
          </button>

          <button
            onClick={() => navigate("/register")}
            className="
              w-full border border-black py-2.5 rounded-lg
              hover:bg-gray-100 transition
            "
          >
            Create your account
          </button>

          <button
            onClick={onClose}
            className="text-gray-500 mt-2 hover:text-black"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
