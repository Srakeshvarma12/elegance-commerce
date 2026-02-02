import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

export default function Cart() {
  const cartItems = useCartStore(state => state.cart);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const increaseQty = useCartStore(state => state.increaseQty);
  const decreaseQty = useCartStore(state => state.decreaseQty);

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20">

        <h1 className="text-2xl md:text-3xl font-serif tracking-widest uppercase mb-8 md:mb-12">
          Shopping Cart
        </h1>

        {cartItems.length === 0 && (
          <p className="text-gray-500">Your cart is empty.</p>
        )}

        {/* RESPONSIVE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">

          {/* LEFT — CART ITEMS */}
          <div className="lg:col-span-2 space-y-6 md:space-y-10">

            {cartItems.map(item => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-6 border-b pb-6"
              >

                {/* IMAGE */}
                <div className="w-full sm:w-40 h-56 sm:h-40 bg-gray-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* INFO */}
                <div className="flex-1 flex flex-col justify-between">

                  <div>
                    <h2 className="text-lg md:text-xl uppercase tracking-widest">
                      {item.name}
                    </h2>

                    <p className="mt-2 text-gray-600 text-sm md:text-base">
                      ₹{item.price} × {item.quantity}
                    </p>

                    {/* QUANTITY CONTROLS */}
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="border w-8 h-8 flex items-center justify-center hover:bg-black hover:text-white"
                      >
                        −
                      </button>

                      <span className="text-sm">{item.quantity}</span>

                      <button
                        onClick={() => increaseQty(item.id)}
                        className="border w-8 h-8 flex items-center justify-center hover:bg-black hover:text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-4 text-sm uppercase tracking-widest text-gray-500 hover:text-black w-fit"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT — ORDER SUMMARY */}
          <div className="border border-black p-6 md:p-10 h-fit">
            <h2 className="text-sm md:text-lg uppercase tracking-widest">
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

            {cartItems.length > 0 && (
              <Link to="/checkout">
                <button className="mt-8 w-full bg-black text-white py-3 md:py-4 uppercase tracking-widest text-xs md:text-sm hover:opacity-80 transition">
                  Proceed to Checkout
                </button>
              </Link>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
