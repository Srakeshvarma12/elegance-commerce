import { useEffect, useState } from "react";
import api from "../services/api";

export default function useWishlistCount() {
  const [count, setCount] = useState(0);
  const token = localStorage.getItem("access");

  useEffect(() => {
    const refresh = async () => {
      if (!token) {
        setCount(0);
        return;
      }

      try {
        const res = await api.get("/wishlist/my/");
        setCount(Array.isArray(res.data) ? res.data.length : 0);
      } catch {
        setCount(0);
      }
    };

    refresh();
    window.addEventListener("wishlist-updated", refresh);

    return () => {
      window.removeEventListener("wishlist-updated", refresh);
    };
  }, [token]);

  return count;
}
