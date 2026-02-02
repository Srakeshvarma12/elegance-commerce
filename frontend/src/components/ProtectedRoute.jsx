import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PageSkeleton from "./PageSkeleton";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access");
  const location = useLocation();
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/auth/profile/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setIsValid(res.ok))
      .catch(() => setIsValid(false));
  }, [token]);

  // ⛔ LOADING SKELETON (nice UX)
  if (isValid === null) {
    return <PageSkeleton />;
  }

  // Not authenticated
  if (!isValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
