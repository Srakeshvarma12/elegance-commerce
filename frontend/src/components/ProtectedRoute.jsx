import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PageSkeleton from "./PageSkeleton";
import api from "../services/api";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access");
  const location = useLocation();
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
  if (!token) {
    setIsValid(false);
    return;
  }

  api.get("/auth/profile/")
    .then(() => setIsValid(true))
    .catch(() => setIsValid(false));
}, [token]);


  // LOADING SKELETON (nice UX)
  if (isValid === null) {
    return <PageSkeleton />;
  }

  // Not authenticated
  if (!isValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
