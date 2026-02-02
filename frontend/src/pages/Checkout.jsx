import { useCartStore } from "../store/cartStore";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const cart = useCartStore(state => state.cart);
  const clearCart = useCartStore(state => state.clearCart);
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handlePayment = async () => {
    if (cart.length === 0) return;

    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please refresh.");
      return;
    }

    let orderId;

    try {
      const orderRes = await fetch("http://127.0.0.1:8000/api/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          total_amount: total,
          items: cart.map(item => ({
            product_id: item.id,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        console.error(orderData);
        alert("Failed to create order.");
        return;
      }

      orderId = orderData.id;
    } catch (err) {
      console.error(err);
      alert("Server error while creating order.");
      return;
    }

    const options = {
      key: "rzp_test_1DP5mmOlF5G5ag",
      amount: total * 100,
      currency: "INR",
      name: "Élégance",
      description: "Order Payment",

      handler: async response => {
        try {
          const updateRes = await fetch(
            `http://127.0.0.1:8000/api/orders/${orderId}/update/`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                payment_id: response.razorpay_payment_id,
              }),
            }
          );

          if (!updateRes.ok) {
            alert("Payment succeeded, but order update failed.");
            return;
          }

          clearCart();
          navigate("/account");
        } catch (err) {
          console.error(err);
          alert("Payment succeeded, but order update failed.");
        }
      },

      theme: { color: "#000000" },
    };

    new window.Razorpay(options).open();
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20">

        <h1 className="text-2xl md:text-3xl font-serif tracking-widest uppercase mb-8 md:mb-12">
          Checkout
        </h1>

        {/* RESPONSIVE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">

          {/* LEFT — CART ITEMS */}
          <div>
            {cart.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {cart.map(item => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b pb-4 text-sm md:text-base"
                  >
                    <span className="uppercase tracking-widest">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ₹{Number(item.price) * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — ORDER SUMMARY */}
          <div className="border border-black p-6 md:p-10 h-fit">
            <h2 className="uppercase tracking-widest text-sm md:text-lg">
              Order Summary
            </h2>

            <div className="mt-6 md:mt-8 space-y-3 md:space-y-4 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="border-t pt-4 flex justify-between text-base md:text-lg">
                <span>Total</span>
                <span className="font-semibold">₹{total}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={cart.length === 0}
              className="mt-8 w-full bg-black text-white py-3 md:py-4 uppercase tracking-widest text-xs md:text-sm hover:opacity-80 transition disabled:opacity-50"
            >
              Complete Purchase
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
