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
    <div className="fixed top-24 right-6 z-[9999] bg-white shadow-xl rounded-xl px-6 py-4 flex gap-3 items-center animate-slide-in">
      <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm">
        ✓
      </span>
      <p className="text-sm">{message}</p>
    </div>
  );
}
