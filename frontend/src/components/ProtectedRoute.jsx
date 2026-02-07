import { Navigate, useLocation } from "react-router-dom";
import PageSkeleton from "./PageSkeleton";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access");
  const location = useLocation();

  // No token → go to login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Token exists → allow access
  return children;
}
