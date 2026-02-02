import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import PageSkeleton from "./PageSkeleton";

export default function RequireAdmin({ children }) {
  const [isAdmin, setIsAdmin] = useState(null);
  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!token) {
      setIsAdmin(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/auth/profile/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        if (!res.ok) return { is_admin: false };
        return await res.json();
      })
      .then(data => setIsAdmin(!!data.is_admin))
      .catch(() => setIsAdmin(false));
  }, [token]);

  // ⛔ LOADING SKELETON
  if (isAdmin === null) {
    return <PageSkeleton />;
  }

  // Not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
