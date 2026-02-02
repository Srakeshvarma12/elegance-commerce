import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Orders() {
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("access")
    if (!token) {
      navigate("/login")
      return
    }

    fetch("http://127.0.0.1:8000/api/orders/", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem("access")
          navigate("/login")
          return null
        }
        return res.json()
      })
      .then(data => {
        if (data) setOrders(data)
      })
  }, [navigate])

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-3xl font-serif mb-8">My Orders</h1>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map(o => (
        <div key={o.id} className="border rounded-xl p-4 mb-4">
          <p><b>Order ID:</b> {o.id}</p>
          <p><b>Total:</b> ${o.total_amount}</p>
          <p><b>Status:</b> {o.is_paid ? "Paid" : "Pending"}</p>
        </div>
      ))}
    </div>
  )
}
