import { Navigate } from "react-router-dom";

export default function RequireAdmin({ children }) {
  const isAdmin = localStorage.getItem("is_admin") === "true";

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
