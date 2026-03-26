import { useToastStore } from "../store/toastStore";
import { useEffect } from "react";

export default function Toast() {
  const { message, visible, hideToast } = useToastStore();

  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      hideToast();
    }, 2000);

    return () => clearTimeout(timer);
  }, [visible, hideToast]);

  if (!visible) return null;

  return (
    <div className="fixed top-24 right-6 z-[9999] bg-white border border-black/10 shadow-[var(--shadow-soft-tight)] rounded-xl px-6 py-4 flex gap-3 items-center animate-fadeIn">
      <span className="w-7 h-7 border border-black/20 rounded-full flex items-center justify-center">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.2 6.4l2.3 2.4 5.2-5.6" />
        </svg>
      </span>
      <p className="text-sm">{message}</p>
    </div>
  );
}
