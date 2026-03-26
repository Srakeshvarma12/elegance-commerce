import { useCartStore } from "../store/cartStore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useUserStore } from "../store/userStore";

export default function Checkout() {
  const cart = useCartStore(state => state.cart);
  const clearCart = useCartStore(state => state.clearCart);
  const navigate = useNavigate();
  const location = useLocation();

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handlePayment = async () => {
    if (cart.length === 0) return;

    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please refresh.");
      return;
    }

    let orderId;

    try {
      const orderRes = await api.post("/orders/", {
        total_amount: total,
        items: cart.map(item => ({
          product_id: item.id,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      orderId = orderRes.data.id;
      const razorpayOrderId = orderRes.data.razorpay_order_id;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: total * 100,
        currency: "INR",
        name: "Elegance",
        description: "Order Payment",
        order_id: razorpayOrderId,

        handler: async response => {
          try {
            await api.put(`/orders/${orderId}/update/`, {
              payment_id: response.razorpay_payment_id,
            });

            clearCart();
            navigate("/account");
          } catch (err) {
            console.error(err);
            alert("Payment succeeded, but order update failed.");
          }
        },

        theme: { color: "#111111" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Server error while creating order.");
      return;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-12 border-b border-black/5 pb-8 text-center md:text-left">
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted mb-4 opacity-70">Payment</p>
        <h1 className="text-4xl md:text-5xl font-display mb-4">Finalize Order</h1>
        <p className="text-muted max-w-xl text-sm leading-relaxed">
          Review your selection and proceed to secure checkout.
        </p>
      </header>

      <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start">
        <section className="flex flex-col gap-8">
          <div className="bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-black/5 p-10 shadow-sm">
            <h2 className="text-[10px] uppercase tracking-[0.4em] mb-8 pb-4 border-b border-black/5 opacity-60">Selection</h2>
            
            {cart.length === 0 ? (
              <p className="text-center py-12 text-muted text-sm italic">Empty selection.</p>
            ) : (
              <div className="flex flex-col gap-6">
                {cart.map(item => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-6 items-center">
                    <div className="w-16 h-20 bg-black/5 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xs uppercase tracking-[0.2em] font-medium truncate max-w-[200px]">{item.name}</h3>
                      <p className="text-[10px] text-muted mt-1 uppercase tracking-widest">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-sm tracking-widest">INR {Number(item.price) * item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <aside className="sticky top-28">
          <div className="bg-white rounded-[2.5rem] border border-black/10 p-10 shadow-2xl">
            <h2 className="text-[10px] uppercase tracking-[0.4em] mb-8 pb-4 border-b border-black/5 opacity-60">Summary</h2>
            
            <div className="flex flex-col gap-5 mb-8">
              <div className="flex justify-between items-center text-xs">
                <span className="opacity-40 uppercase tracking-widest">Subtotal</span>
                <span className="tracking-widest font-medium">INR {total}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="opacity-40 uppercase tracking-widest">Shipping</span>
                <span className="text-green-600 uppercase tracking-[0.2em] font-semibold">Complimentary</span>
              </div>
            </div>

            <div className="pt-8 border-t border-black/5 mb-10 flex justify-between items-end">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-1">Grand Total</p>
                <span className="font-display text-2xl tracking-widest text-ink">INR {total}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={cart.length === 0}
              className="btn-elegant w-full py-5 bg-ink text-white text-[10px] hover:bg-ink/90 shadow-xl shadow-black/10 disabled:opacity-30 disabled:scale-100"
            >
              Secure Checkout –&gt;
            </button>

            <div className="mt-8 flex items-center justify-center gap-2 opacity-30 grayscale contrast-125 scale-75">
              {/* Razorpay Logo Placeholder/SVG could go here */}
              <p className="text-[9px] uppercase tracking-[0.3em] font-bold">Secure Payment via Razorpay</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
