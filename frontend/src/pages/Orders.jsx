import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
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
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.removeItem("access");
          navigate("/login");
        }
      });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="section-container pt-12 pb-8 md:pt-16 md:pb-10">
        <p className="label mb-2">History</p>
        <h1 className="heading-xl">Your Orders</h1>
      </header>

      <div className="section-container pb-20">
        {orders.length === 0 ? (
          <div className="card p-16 text-center">
            <p className="text-text-muted mb-6">You haven't placed any orders yet.</p>
            <LiquidButton size="lg" onClick={() => navigate('/shop')} className="!text-text-primary font-semibold">Start Shopping</LiquidButton>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map(order => (
              <div key={order.id} className="card p-6 flex flex-col md:flex-row gap-6 items-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-text-primary text-white rounded-xl flex items-center justify-center font-bold text-xs shrink-0">
                  #{order.id.toString().slice(-4)}
                </div>

                <div className="flex-grow grid grid-cols-2 md:grid-cols-3 gap-4 text-center md:text-left">
                  <div>
                    <p className="text-xs text-text-muted mb-1">Total</p>
                    <p className="text-base font-bold">${order.total_amount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-1">Status</p>
                    <div className="flex items-center justify-center md:justify-start gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${order.is_paid ? "bg-success" : "bg-amber-400"}`} />
                      <span className="text-sm font-medium">{order.is_paid ? "Paid" : "Pending"}</span>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-xs text-text-muted mb-1">Order ID</p>
                    <p className="text-xs text-text-muted">#{order.id}</p>
                  </div>
                </div>

                <LiquidButton size="sm" onClick={() => navigate('/account')} className="!text-text-secondary text-xs font-medium shrink-0">
                  Details
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </LiquidButton>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
