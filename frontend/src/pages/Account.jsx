import { useUserStore } from "../store/userStore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";

export default function Account() {
  const { username: storeUsername, avatarUrl: storeAvatarUrl } = useUserStore();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  useEffect(() => {
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
      .catch(() => navigate("/login"));
  }, [token, navigate]);

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    localStorage.removeItem("is_admin");
    window.location.href = "/login";
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/5 pb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted mb-4 opacity-70">Account</p>
          <h1 className="text-4xl md:text-5xl font-display mb-4">My Orders</h1>
          <p className="text-muted max-w-xl text-sm leading-relaxed">
            Track your recent purchases and status.
          </p>
        </div>
        <button onClick={logout} className="text-[10px] uppercase tracking-widest text-red-500 hover:text-red-700 transition font-medium">
          Logout
        </button>
      </header>

      {orders.length === 0 && (
        <div className="text-center py-24 bg-white/30 rounded-3xl border border-dashed border-black/10">
          <p className="text-muted text-sm">No orders yet.</p>
          <Link to="/shop" className="btn-elegant inline-block mt-8 text-[10px]">
            Explore Collection
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-8">
        {orders.map(order => (
          <div key={order.id} className="bg-white/50 backdrop-blur-sm rounded-3xl border border-black/5 p-8 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-black/5">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted mb-2">Order ID</p>
                <p className="font-medium text-sm">#{order.id}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted mb-2">Total</p>
                <p className="font-medium text-sm">INR {order.total_amount}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted mb-2">Status</p>
                <p className="font-medium text-sm uppercase tracking-wider text-[10px] bg-black/5 px-3 py-1 rounded-full inline-block">
                  {order.status}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted mb-2">Date</p>
                <p className="font-medium text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-[10px] uppercase tracking-widest text-muted">Items</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(order.items || []).map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-black/5 px-5 py-4 rounded-xl text-sm">
                    <span className="font-medium">{item.product_name || item.name || "Item"}</span>
                    <span className="text-muted text-xs">
                      {item.quantity} x INR {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

