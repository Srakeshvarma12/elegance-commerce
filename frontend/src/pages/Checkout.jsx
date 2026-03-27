import { useCartStore } from "../store/cartStore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export default function Checkout() {
  const cart = useCartStore(state => state.cart);
  const clearCart = useCartStore(state => state.clearCart);
  const navigate = useNavigate();
  const location = useLocation();

  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const handlePayment = async () => {
    if (cart.length === 0) return;
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    if (!window.Razorpay) {
      alert("Payment system is loading. Please refresh and try again.");
      return;
    }

    try {
      const orderRes = await api.post("/orders/", {
        total_amount: total,
        items: cart.map(item => ({
          product_id: item.id,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      const orderId = orderRes.data.id;
      const razorpayOrderId = orderRes.data.razorpay_order_id;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: total * 100,
        currency: "INR",
        name: "ELEGANCE",
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
            alert("Payment succeeded, but order update failed. Please contact support.");
          }
        },
        theme: { color: "#111111" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Unable to process your order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="section-container pt-12 pb-6 md:pt-16 md:pb-8 text-center">
        <p className="label mb-2">Secure Checkout</p>
        <h1 className="heading-lg">Complete Your Order</h1>
      </header>

      <div className="section-container pb-20 max-w-5xl grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
        {/* Order Review */}
        <div className="flex flex-col gap-6">
          <div className="card p-8">
            <h2 className="font-semibold text-base mb-6 pb-4 border-b border-border">Order Review</h2>
            {cart.length === 0 ? (
              <p className="text-text-muted text-center py-8">Your cart is empty.</p>
            ) : (
              <div className="flex flex-col gap-5">
                {cart.map(item => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 items-center">
                    <div className="w-14 h-14 bg-bg-subtle rounded-lg overflow-hidden p-1.5 shrink-0">
                      <img src={item.image} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="text-sm font-semibold truncate">{item.name}</h3>
                      <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold shrink-0">${Number(item.price) * item.quantity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-8 bg-bg-subtle">
            <div className="flex gap-4 items-start">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted shrink-0 mt-0.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <div>
                <h3 className="text-sm font-semibold mb-1">Secure & Protected</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Your payment information is encrypted and processed securely.
                  All orders include free shipping and our 30-day return guarantee.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <aside className="card-elevated p-8 sticky top-[88px]">
          <h2 className="font-semibold text-base mb-6 pb-4 border-b border-border">Payment Summary</h2>

          <div className="flex flex-col gap-3 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Subtotal</span>
              <span className="font-medium">${total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Shipping</span>
              <span className="font-medium text-success">Free</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between items-end">
              <span className="font-semibold">Total</span>
              <span className="text-2xl font-bold">${total}</span>
            </div>
          </div>

          <LiquidButton
            size="xl"
            onClick={handlePayment}
            disabled={cart.length === 0}
            className="!text-text-primary font-semibold w-full disabled:opacity-40 disabled:pointer-events-none"
          >
            Pay Now
          </LiquidButton>

          <p className="text-[11px] text-text-muted text-center mt-4 leading-relaxed">
            By placing your order, you agree to our terms & conditions.
          </p>
        </aside>
      </div>
    </div>
  );
}
