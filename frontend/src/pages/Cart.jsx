import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { useState } from "react";
import { useUserStore } from "../store/userStore";

export default function Cart() {
  const navigate = useNavigate();
  const cartItems = useCartStore(state => state.cart);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const increaseQty = useCartStore(state => state.increaseQty);
  const decreaseQty = useCartStore(state => state.decreaseQty);

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/5 pb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted mb-4 opacity-70">Basket</p>
          <h1 className="text-4xl md:text-5xl font-display mb-4">Shopping Cart</h1>
          <p className="text-muted max-w-xl text-sm leading-relaxed">
            Review your selection before finalizing your order.
          </p>
        </div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted font-medium">
          {cartItems.length} items
        </div>
      </header>

      {cartItems.length === 0 && (
        <div className="text-center py-32 bg-white/30 rounded-3xl border border-dashed border-black/10">
          <p className="text-muted text-sm mb-8">Your cart is currently empty.</p>
          <Link to="/shop" className="btn-elegant inline-block text-[10px]">
            Explore Collection
          </Link>
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 items-start">
          <div className="flex flex-col gap-6">
            {cartItems.map(item => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="bg-white/50 backdrop-blur-sm rounded-3xl border border-black/5 p-6 flex flex-col md:flex-row gap-8 items-center shadow-sm">
                <div className="w-32 h-40 bg-black/5 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-grow flex flex-col gap-4 text-center md:text-left">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted mb-1">Piece</p>
                    <h3 className="font-display text-xl">{item.name}</h3>
                  </div>
                  <p className="text-xs text-muted tracking-wide">
                    INR {item.price} {item.size && `• Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                  </p>

                  <div className="flex items-center justify-center md:justify-start gap-6 mt-2">
                    <div className="flex items-center bg-black/5 rounded-full px-4 py-2 gap-4">
                      <button
                        onClick={() => decreaseQty(item.id, item.size, item.color)}
                        className="w-6 h-6 flex items-center justify-center text-ink/40 hover:text-ink transition"
                      >
                        –
                      </button>
                      <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => increaseQty(item.id, item.size, item.color)}
                        className="w-6 h-6 flex items-center justify-center text-ink/40 hover:text-ink transition"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id, item.size, item.color)}
                      className="text-[10px] uppercase tracking-widest text-muted hover:text-red-500 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="md:ml-auto text-right">
                  <p className="text-[10px] uppercase tracking-widest text-muted mb-1">Subtotal</p>
                  <p className="font-display text-lg tracking-widest">INR {Number(item.price) * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <aside className="sticky top-28 bg-ink text-white p-10 rounded-[2.5rem] shadow-xl">
            <h2 className="text-[10px] uppercase tracking-[0.4em] mb-10 pb-4 border-b border-white/10 opacity-60">Order Summary</h2>
            
            <div className="flex flex-col gap-6 mb-10">
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-60 uppercase tracking-widest text-[10px]">Subtotal</span>
                <span className="tracking-widest">INR {total}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-60 uppercase tracking-widest text-[10px]">Shipping</span>
                <span className="text-green-400 uppercase tracking-widest text-[10px]">Complimentary</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8 mb-10 flex justify-between items-end">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] opacity-50 mb-1">Grand Total</p>
                <p className="text-3xl font-display tracking-widest">INR {total}</p>
              </div>
            </div>

            <Link to="/checkout" className="btn-elegant w-full py-5 bg-white text-ink text-[10px] hover:bg-white/90">
              Proceed to Checkout –&gt;
            </Link>

            <p className="mt-8 text-[9px] uppercase tracking-[0.2em] text-center opacity-40 leading-loose">
              Taxes and duties included where applicable. 
              Refined logistics for a seamless delivery.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}

