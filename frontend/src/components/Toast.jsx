import { useToastStore } from "../store/toastStore";
import { useEffect } from "react";

export default function Toast() {
  const { message, visible, hideToast } = useToastStore();

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      hideToast();
    }, 2500);
    return () => clearTimeout(timer);
  }, [visible, hideToast]);

  if (!visible) return null;

  return (
    <div className="fixed top-20 right-6 z-[9999] animate-slideDown">
      <div className="bg-white border border-border shadow-lg rounded-xl px-5 py-3.5 flex items-center gap-3 max-w-sm">
        <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-success">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <p className="text-sm font-medium text-text-primary">{message}</p>
      </div>
    </div>
  );
}
