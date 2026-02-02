import { useEffect, useState } from "react";

export default function useWishlistCount() {
  const [count, setCount] = useState(0);
  const token = localStorage.getItem("access");

  useEffect(() => {
  const refresh = () => {
    if (!token) return setCount(0);

    fetch("http://127.0.0.1:8000/api/wishlist/my/", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(res => res.json())
      .then(data => setCount(data.length))
      .catch(() => setCount(0));
  };

  refresh();
  window.addEventListener("wishlist-updated", refresh);

  return () => {
    window.removeEventListener("wishlist-updated", refresh);
  };
}, [token]);


  return count;
}
