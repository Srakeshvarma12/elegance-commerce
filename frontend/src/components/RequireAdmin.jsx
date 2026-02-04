import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import PageSkeleton from "./PageSkeleton";
import api from "../services/api";

export default function RequireAdmin({ children }) {
  const [isAdmin, setIsAdmin] = useState(null);
  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!token) {
      setIsAdmin(false);
      return;
    }

    api.get("/auth/profile/")
      .then(res => setIsAdmin(!!res.data.is_admin))
      .catch(() => setIsAdmin(false));
  }, [token]);

  // LOADING SKELETON
  if (isAdmin === null) {
    return <PageSkeleton />;
  }

  // Not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
