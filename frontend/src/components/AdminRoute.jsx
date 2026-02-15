import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("access");
  const isAdmin = localStorage.getItem("is_admin") === "true"; // <-- FIXED

  if (!token || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
