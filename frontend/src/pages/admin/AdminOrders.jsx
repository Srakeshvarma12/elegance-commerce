import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("access");

  // UPDATE ORDER STATUS (ADMIN)
  const updateStatus = async (orderId, status) => {
    try {
      await api.put(
        `/orders/admin/orders/${orderId}/update/`,
        { status }
      );

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status }
            : order
        )
      );
    } catch (err) {
      console.error("Status update error:", err);
      alert("Server error while updating status");
    }
  };

  // FETCH ALL ORDERS (ADMIN ONLY)
  useEffect(() => {
    if (!token) {
      setError("Not authorized");
      setLoading(false);
      return;
    }

    api.get("/orders/admin/orders/")
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Admin orders error:", err);

        if (err.response?.status === 401) {
          setError("Unauthorized — please log in as admin");
        } else {
          setError("Failed to load orders");
        }

        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return <div className="py-40 text-center">Loading orders...</div>;
  }

  if (error) {
    return (
      <div className="py-40 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-10 py-24">
      <h1 className="text-3xl font-serif tracking-widest mb-12">
        Admin Orders
      </h1>

      <div className="space-y-10">
        {orders.map(order => (
          <div key={order.id} className="border p-8">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>User:</strong> {order.user}</p>
            <p><strong>Total:</strong> ₹{order.total_amount}</p>

            <div className="mt-4">
              <p className="uppercase tracking-widest text-sm mb-2">
                Status
              </p>

              <select
                value={order.status}
                onChange={e =>
                  updateStatus(order.id, e.target.value)
                }
                className="border px-4 py-2"
              >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="mt-6">
              <p className="uppercase tracking-widest text-sm mb-2">
                Items
              </p>
              {order.items.map(item => (
                <p key={item.id}>
                  {item.name} × {item.quantity}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
