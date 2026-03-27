import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export default function Cart() {
  const navigate = useNavigate();
  const cartItems = useCartStore(state => state.cart);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const increaseQty = useCartStore(state => state.increaseQty);
  const decreaseQty = useCartStore(state => state.decreaseQty);
  const total = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="section-container pt-12 pb-6 md:pt-16 md:pb-8">
        <p className="label mb-2">Review</p>
        <h1 className="heading-xl">Shopping Cart</h1>
      </header>

      {cartItems.length === 0 ? (
        <div className="section-container pb-20">
          <div className="card p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-bg-subtle flex items-center justify-center mx-auto mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <p className="text-text-muted mb-6">Your cart is empty</p>
            <LiquidButton size="lg" onClick={() => navigate('/shop')} className="!text-text-primary font-semibold">Continue Shopping</LiquidButton>
          </div>
        </div>
      ) : (
        <div className="section-container pb-20 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
          {/* Cart Items */}
          <div className="flex flex-col gap-4">
            {cartItems.map(item => (
              <div
                key={`${item.id}-${item.size}-${item.color}`}
                className="card p-6 flex flex-col sm:flex-row gap-6 items-center"
              >
                <div className="w-24 h-24 bg-bg-subtle rounded-xl overflow-hidden p-2 shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>

                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-semibold text-base tracking-tight mb-1">{item.name}</h3>
                  <p className="text-xs text-text-muted mb-3">
                    {item.size && `Size: ${item.size}`}{item.size && item.color && " · "}{item.color && `Color: ${item.color}`}
                  </p>

                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <div className="flex items-center bg-bg-subtle rounded-lg">
                      <button
                        onClick={() => decreaseQty(item.id, item.size, item.color)}
                        className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => increaseQty(item.id, item.size, item.color)}
                        className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id, item.size, item.color)}
                      className="text-xs font-medium text-error hover:underline transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-lg font-bold">${Number(item.price) * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <aside className="card-elevated sticky top-[88px] p-8 flex flex-col gap-6">
            <h2 className="font-semibold text-base">Order Summary</h2>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Subtotal</span>
                <span className="font-medium">${total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Shipping</span>
                <span className="font-medium text-success">Free</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold">${total}</span>
              </div>
            </div>

            <LiquidButton
              size="xl"
              onClick={() => navigate("/checkout")}
              className="!text-text-primary font-semibold w-full"
            >
              Proceed to Checkout →
            </LiquidButton>

            <p className="text-[11px] text-text-muted text-center leading-relaxed">
              Taxes calculated at checkout. Secure payment processing.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
