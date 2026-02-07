import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate("/admin/products")}
          className="bg-blue-600 text-white p-4 rounded-lg"
        >
          Manage Products
        </button>

        <button
          onClick={() => navigate("/admin/orders")}
          className="bg-green-600 text-white p-4 rounded-lg"
        >
          Manage Orders
        </button>

        <button
          onClick={() => navigate("/admin/users")}
          className="bg-purple-600 text-white p-4 rounded-lg"
        >
          Manage Users
        </button>
      </div>
    </div>
  );
}
