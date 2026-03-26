import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { useToastStore } from "../store/toastStore";
import api from "../services/api";
import { useUserStore } from "../store/userStore";

export default function Wishlist() {
  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  const addToCart = useCartStore(state => state.addToCart);
  const items = useWishlistStore(state => state.items);
  const setWishlist = useWishlistStore(state => state.setWishlist);
  const removeItem = useWishlistStore(state => state.removeItem);
  const showToast = useToastStore(state => state.showToast);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/wishlist/my/")
      .then(res => {
        setWishlist(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load wishlist");
        setLoading(false);
      });
  }, [token, setWishlist]);

  const removeFromWishlist = async productId => {
    try {
      if (token) {
        await api.post(`/wishlist/toggle/${productId}/`);
      }
      removeItem(productId);
      showToast("Removed from wishlist");
    } catch {
      showToast("Action failed");
    }
  };

  const handleAddToCart = async item => {
    addToCart({
      id: item.product,
      name: item.product_name,
      price: item.product_price,
      image: item.product_image,
      quantity: 1,
    });

    try {
      if (token) {
        await api.post(`/wishlist/toggle/${item.product}/`);
      }
      removeItem(item.product);
      showToast("Added to cart");
    } catch {
      showToast("Action failed");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-[10px] uppercase tracking-widest text-muted animate-pulse">Gathering favorites...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/5 pb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted mb-4 opacity-70">Collection</p>
          <h1 className="text-4xl md:text-5xl font-display mb-4">My Wishlist</h1>
          <p className="text-muted max-w-xl text-sm leading-relaxed">
            Save your favorites and move them to cart anytime.
          </p>
        </div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted font-medium">
          {items.length} items
        </div>
      </header>

      {error && (
        <div className="text-center py-20 bg-white/30 rounded-3xl border border-dashed border-black/10">
          <p className="text-muted text-sm">{error}</p>
        </div>
      )}

      {items.length === 0 && !error && (
        <div className="text-center py-32 bg-white/30 rounded-3xl border border-dashed border-black/10">
          <p className="text-muted text-sm mb-8">Your wishlist is empty.</p>
          <Link to="/shop" className="btn-elegant inline-block text-[10px]">
            Explore Collection
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.map(item => (
          <div key={item.id} className="group relative">
            <div className="rounded-[1.8rem] overflow-hidden bg-white/50 border border-black/5 shadow-sm transition-all duration-500 hover:-translate-y-2">
              <div
                className="h-[280px] bg-black/5 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/product/${item.product}`)}
              >
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
              </div>
              <div className="p-6">
                <p className="text-[10px] uppercase tracking-widest text-muted mb-2">Saved Piece</p>
                <h3 className="font-display text-lg mb-2 truncate">{item.product_name}</h3>
                <p className="text-xs tracking-widest text-muted mb-6">INR {item.product_price}</p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="btn-elegant w-full text-[10px] py-4 bg-ink text-white"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.product)}
                    className="text-[10px] uppercase tracking-widest text-muted hover:text-red-500 transition py-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

