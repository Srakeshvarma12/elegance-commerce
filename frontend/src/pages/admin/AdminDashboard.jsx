import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.is_staff) {
      navigate("/"); // send normal users back to home
    }
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Admin Dashboard</h1>
      <p>Only Admin can see this page.</p>

      <div style={{ marginTop: "20px" }}>
        <a href="https://elegance-commerce.onrender.com/admin/" target="_blank">
          👉 Open Django Admin Panel
        </a>
      </div>
    </div>
  );
}
