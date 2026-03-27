import { useUserStore } from "../store/userStore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export default function Account() {
  const { username: storeUsername } = useUserStore();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    api.get("/orders/")
      .then(res => {
        const data = res.data;
        const results = Array.isArray(data) ? data : data.results || [];
        setOrders(results);
      })
      .catch(() => navigate("/login"));
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="section-container pt-12 pb-8 md:pt-16 md:pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="label mb-2">Account</p>
          <h1 className="heading-xl">My Orders</h1>
        </div>
        <LiquidButton size="default" onClick={() => navigate('/profile')} className="!text-text-primary font-medium">
          View Profile
        </LiquidButton>
      </header>

      <div className="section-container pb-20">
        {orders.length === 0 ? (
          <div className="card p-16 text-center">
            <p className="text-text-muted mb-6">No orders yet.</p>
            <LiquidButton size="lg" onClick={() => navigate('/shop')} className="!text-text-primary font-semibold">Start Shopping</LiquidButton>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map(order => (
              <div key={order.id} className="card p-6 md:p-8">
                {/* Order header */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center mb-6 pb-6 border-b border-border">
                  <div>
                    <p className="text-xs text-text-muted mb-1">Order</p>
                    <p className="font-semibold text-sm">#{order.id.toString().slice(-4)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-1">Total</p>
                    <p className="font-semibold text-sm">${order.total_amount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-1">Status</p>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${order.is_paid ? "bg-success" : "bg-amber-400"}`} />
                      <span className="text-xs font-medium">{order.is_paid ? "Paid" : "Pending"}</span>
                    </div>
                  </div>
                  <div className="md:text-right">
                    <p className="text-xs text-text-muted mb-1">Date</p>
                    <p className="text-xs font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Order items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(order.items || []).map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-bg-subtle px-4 py-3 rounded-lg">
                      <span className="text-sm font-medium">{item.product_name || item.name || "Product"}</span>
                      <span className="text-xs text-text-muted">{item.quantity} × ${item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
