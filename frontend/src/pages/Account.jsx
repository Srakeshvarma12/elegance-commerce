import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://127.0.0.1:8000/api/orders/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(() => navigate("/login"));
  }, []);

  function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  window.location.href = "/login";
}

  return (
    <div style={{ padding: "60px", maxWidth: "900px", margin: "auto" }}>
      <h1 style={{ fontSize: "36px", marginBottom: "20px" }}>My Account</h1>

      <button
        onClick={logout}
        style={{
          marginBottom: "30px",
          padding: "10px 20px",
          border: "1px solid black",
          cursor: "pointer"
        }}
      >
        Logout
      </button>

      <h2 style={{ fontSize: "26px", marginBottom: "20px" }}>My Orders</h2>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map(order => (
        <div
          key={order.id}
          style={{
            border: "1px solid black",
            padding: "20px",
            marginBottom: "25px"
          }}
        >
          <p><b>Order ID:</b> {order.id}</p>
          <p><b>Total:</b> ${order.total_amount}</p>
          <p><b>Status:</b> {order.status}</p>

          <hr style={{ margin: "15px 0" }} />

          <h3>Items</h3>

          {order.items.map(item => (
            <div key={item.id} style={{ marginBottom: "8px" }}>
              {item.product_name} — {item.quantity} × ${item.price}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
