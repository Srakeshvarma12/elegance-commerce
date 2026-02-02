import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-10 py-24">
      <h1 className="text-3xl font-serif uppercase mb-10">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* ORDERS */}
        <div
          onClick={() => navigate("/admin/orders")}
          className="border p-6 cursor-pointer
                     hover:bg-black hover:text-white
                     transition"
        >
          <h2 className="uppercase tracking-widest">
            Orders
          </h2>
          <p className="mt-2">
            Manage customer orders
          </p>
        </div>

        {/* PRODUCTS */}
        <div
          className="border p-6 opacity-50 cursor-not-allowed"
          title="Coming soon"
        >
          <h2 className="uppercase tracking-widest">
            Products
          </h2>
          <p className="mt-2 text-gray-600">
            Add / Edit products
          </p>
        </div>

        {/* USERS */}
        <div
          className="border p-6 opacity-50 cursor-not-allowed"
          title="Coming soon"
        >
          <h2 className="uppercase tracking-widest">
            Users
          </h2>
          <p className="mt-2 text-gray-600">
            View customers
          </p>
        </div>

      </div>
    </div>
  );
}
