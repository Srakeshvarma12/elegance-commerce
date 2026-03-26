import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      navigate("/login");
      return;
    }

    api
      .get("/orders/")
      .then(res => {
        const data = res.data;
        const results = Array.isArray(data) ? data : data.results || [];
        setOrders(results);
      })
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.removeItem("access");
          navigate("/login");
        }
      });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-cream pt-24">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl md:text-4xl tracking-[0.3em] uppercase mb-10">
          My Orders
        </h1>

        {orders.length === 0 && (
          <p className="text-muted">No orders yet.</p>
        )}

        <div className="space-y-6">
          {orders.map(order => (
            <div
              key={order.id}
              className="border border-black/10 bg-white p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
                <div>
                  <p className="uppercase tracking-[0.3em] text-xs text-muted">
                    Order ID
                  </p>
                  <p className="mt-1">{order.id}</p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.3em] text-xs text-muted">
                    Total
                  </p>
                  <p className="mt-1">₹{order.total_amount}</p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.3em] text-xs text-muted">
                    Status
                  </p>
                  <p className="mt-1">{order.is_paid ? "Paid" : "Pending"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
