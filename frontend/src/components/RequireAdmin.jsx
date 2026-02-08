import { Navigate } from "react-router-dom";

export default function RequireAdmin({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user.is_staff) {
    return <Navigate to="/" replace />;
  }

  return children;
}
